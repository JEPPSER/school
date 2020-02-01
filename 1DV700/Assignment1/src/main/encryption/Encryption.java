package main.encryption;

import java.util.Arrays;

public class Encryption {
	
	public static String subEncrypt(String message, char key) {
		String result = "";
		for (byte b : message.getBytes()) {
			result += (char) ((int) b ^ (int) key);
		}
		return result;
	}
	
	public static String subDecrypt(String message, char key) {
		String result = "";
		for (byte b : message.getBytes()) {
			result += (char) ((int) b ^ (int) key);
		}
		return result;
	}
	
	public static String transEncrypt(String message, String key) {
		// Derive encryption order from key.
		char[] chars = key.toCharArray();
		Arrays.sort(chars);
		int[] positions = new int[chars.length];
		for (int i = 0; i < chars.length; i++) {
			positions[i] = indexOfChar(chars, key.charAt(i));
		}
		
		// Create encryption matrix.
		char[][] matrix = new char[(int) Math.ceil((float) message.length() / (float) key.length())][key.length()];
		
		// Fills matrix with chars from message.
		int counter = 0;
		for (int i = 0; i < matrix.length; i++) {
			for (int j = 0; j < matrix[i].length; j++) {
				if (counter >= message.length()) {
					break;
				}
				matrix[i][j] = message.charAt(counter);
				counter++;
			}
		}
		
		// Creates a string from reading the columns in the matrix in the order derived from the key.
		String result = "";
		for (int i : positions) {
			for (int j = 0; j < matrix.length; j++) {
				result += matrix[j][i];
			}
		}
		return result;
	}
	
	public static String transDecrypt(String message, String key) {
		// Derive encryption order of columns from key.
		char[] chars = key.toCharArray();
		Arrays.sort(chars);
		int[] positions = new int[chars.length];
		for (int i = 0; i < chars.length; i++) {
			positions[i] = indexOfChar(chars, key.charAt(i));
		}
		
		// Create encryption matrix.
		char[][] matrix = new char[(int) Math.ceil((float) message.length() / (float) key.length())][key.length()];
		
		// Fill the matrix with chars from message in order derived from key.
		int counter = 0;
		for (int i : positions) {
			for (int j = 0; j < matrix.length; j++) {
				matrix[j][i] = message.charAt(counter);
				counter++;
			}
		}
		
		// Read the matrix in normal order and put in result string.
		String result = "";
		for (int i = 0; i < matrix.length; i++) {
			for (int j = 0; j < matrix[i].length; j++) {
				result += matrix[i][j];
			}
		}
		
		return result;
	}
	
	private static int indexOfChar(char[] chars, char c) {
		for (int i = 0; i < chars.length; i++) {
			if (chars[i] == c) {
				return i;
			}
		}
		return -1;
	}
}
