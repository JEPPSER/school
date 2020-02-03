package main;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;

import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.Alert.AlertType;
import javafx.scene.control.Button;
import javafx.scene.control.RadioButton;
import javafx.scene.control.TextField;
import javafx.scene.control.ToggleGroup;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.scene.text.Text;
import javafx.stage.FileChooser;
import javafx.stage.Stage;
import main.encryption.Encryption;

public class Main extends Application {

	public static void main(String[] args) {
		launch();
	}

	@Override
	public void start(Stage primaryStage) throws Exception {
		VBox root = new VBox();
		root.setPadding(new Insets(5, 5, 5, 5));
		root.setSpacing(5);

		HBox urlBox = new HBox();
		urlBox.setSpacing(5);
		Text urlText = new Text("File:");
		TextField urlField = new TextField();
		Button browseBtn = new Button("Browse");
		FileChooser fc = new FileChooser();
		browseBtn.setOnAction(e -> {
			urlField.setText(fc.showOpenDialog(primaryStage).getAbsolutePath());
		});
		urlBox.getChildren().add(urlText);
		urlBox.getChildren().add(urlField);
		urlBox.getChildren().add(browseBtn);
		root.getChildren().add(urlBox);

		RadioButton sub = new RadioButton("Substitution");
		sub.setSelected(true);
		RadioButton trans = new RadioButton("Transposition");
		ToggleGroup tg = new ToggleGroup();
		sub.setToggleGroup(tg);
		trans.setToggleGroup(tg);
		root.getChildren().add(sub);
		root.getChildren().add(trans);

		HBox keyBox = new HBox();
		keyBox.setSpacing(5);
		TextField keyField = new TextField();
		Text keyText = new Text("Key:");
		keyBox.getChildren().add(keyText);
		keyBox.getChildren().add(keyField);
		root.getChildren().add(keyBox);

		HBox buttonsBox = new HBox();
		buttonsBox.setSpacing(5);
		Button encryptBtn = new Button("Encrypt");
		Button decryptBtn = new Button("Decrypt");
		buttonsBox.getChildren().add(encryptBtn);
		buttonsBox.getChildren().add(decryptBtn);
		root.getChildren().add(buttonsBox);

		encryptBtn.setOnAction(e -> {
			if (urlField.getText().equals("")) {
				warningAlert("Please select a file to encrypt!");
			} else {
				try {
					String message = new String(Files.readAllBytes(Paths.get(urlField.getText())));
					String[] parts = urlField.getText().split("\\.");
					String outputPath = parts[parts.length - 2] + "-encrypted.txt";

					if (sub.isSelected()) {
						if (!isNumeric(keyField.getText()) || Integer.parseInt(keyField.getText()) < 0
								|| Integer.parseInt(keyField.getText()) > 255) {
							warningAlert("Substitution keys must be a number between 0-255.");
						} else {
							String str = Encryption.subEncrypt(message, (char) Integer.parseInt(keyField.getText()));
							createTextFile(str, outputPath);
						}
					} else if (trans.isSelected()) {
						String key = removeDuplicates(keyField.getText());
						if (!isAlphabetic(key)) {
							warningAlert("Transposition keys must be an alphabetic string.");
						} else {
							String str = Encryption.transEncrypt(message, key);
							createTextFile(str, outputPath);
						}
					}
				} catch (IOException e1) {
					e1.printStackTrace();
				}
			}
		});

		decryptBtn.setOnAction(e -> {
			if (urlField.getText().equals("")) {
				warningAlert("Please select a file to encrypt!");
			} else {
				try {
					String message = new String(Files.readAllBytes(Paths.get(urlField.getText())));
					String[] parts = urlField.getText().split("\\.");
					String outputPath = parts[parts.length - 2] + "-decrypted.txt";

					if (sub.isSelected()) {
						if (!isNumeric(keyField.getText()) || Integer.parseInt(keyField.getText()) < 0
								|| Integer.parseInt(keyField.getText()) > 255) {
							warningAlert("Substitution keys must be a number between 0-255.");
						} else {
							String str = Encryption.subDecrypt(message, (char) Integer.parseInt(keyField.getText()));
							createTextFile(str, outputPath);
						}
					} else if (trans.isSelected()) {
						String key = removeDuplicates(keyField.getText());
						if (!isAlphabetic(key)) {
							warningAlert("Transposition keys must be an alphabetic string.");
						} else {
							String str = Encryption.transDecrypt(message, key);
							createTextFile(str, outputPath);
						}
					}
				} catch (IOException e1) {
					e1.printStackTrace();
				}
			}
		});

		primaryStage.setScene(new Scene(root));
		primaryStage.show();
	}

	private void warningAlert(String message) {
		Alert alert = new Alert(AlertType.WARNING);
		alert.setTitle("WARNING");
		alert.setHeaderText(message);
		alert.showAndWait();
	}

	private boolean isNumeric(String str) {
		return str.matches("\\d+");
	}
	
	private boolean isAlphabetic(String str) {
		for (byte c : str.getBytes()) {
			if (!Character.isAlphabetic(c)) {
				return false;
			}
		}
		return true;
	}
	
	private boolean hasDuplicates(String str) {
		ArrayList<Byte> chars = new ArrayList<Byte>();
		for (byte c : str.getBytes()) {
			if (chars.contains(c)) {
				return true;
			} else {
				chars.add(c);
			}
		}
		return false;
	}
	
	private String removeDuplicates(String str) {
		String result = "";
		ArrayList<Byte> chars = new ArrayList<Byte>();
		for (byte c : str.getBytes()) {
			if (!chars.contains(c)) {
				chars.add(c);
				result += (char) c;
			}
		}
		return result;
	}

	private static void createTextFile(String message, String path) {
		try {
			PrintWriter writer = new PrintWriter(path);
			writer.print(message);
			writer.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
	}
}
