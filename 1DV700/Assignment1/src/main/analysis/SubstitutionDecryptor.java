package main.analysis;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class SubstitutionDecryptor {
	
	private static char[] cipherFrom = { '*', ' ', 'e', 'r', 'j', 'o', 'h', 'n', 'H', 'l', 'i', 'n', 'S', 'c', 't', 'm', 's', 'a', 'g', '-', 't', 'p', 'u', 'd', 'M', 'y', 'b', 'k', 'v', 'w', 'f', 't', 'q',
			',', 'I', 'f' , 'j', };
	private static char[] cipherTo = { 'M', '#', '^', '6', 'o', '3', '{', '2', 'm', '0', '|', '2', 'x', '[', '8', '1', '7', '?', '`', 'P', 'y', '4', '9' , ']', 'r', 'd', '@', '~', 'a', 'b', '_', 'B', '5',
			'O', 'n', 'k' , '}'}; 

	public static void main(String[] args) {
		for (int i = 0; i < cipherFrom.length; i++) {
			System.out.println(cipherFrom[i] + ": " + (cipherTo[i] - cipherFrom[i]));
		}
		try {
			String str = new String(Files.readAllBytes(Paths.get("John Herrlin Sub.txt")));
			str = replaceAll(str);
			System.out.println(str);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	private static String replaceAll(String str) {
		String result = "";
		for (byte b : str.getBytes()) {
			for (int i = 0; i < cipherFrom.length; i++) {
				if ((char) b == cipherTo[i]) {
					result += cipherFrom[i];
					break;
				}
				if (i == cipherFrom.length - 1) {
					result += (char) b;
				}
			}
		}
		return result;
	}
}
