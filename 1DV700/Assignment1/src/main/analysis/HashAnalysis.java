package main.analysis;

import java.util.ArrayList;
import java.util.Collections;

import main.encryption.Encryption;

public class HashAnalysis {

	public static void main(String[] args) {
		//uniformityTest();
		//sameByteValueTest();
		incrementalByteValueTest();
	}
	
	private static void incrementalByteValueTest() {
		for (int i = 0; i < 1000; i++) {
			String str = generateRandomString() + " ";
			StringBuilder sb = new StringBuilder(str);
			
			int index = str.length() - 1;
			for (int j = 0; j < 10; j++) {
				sb.setCharAt(index, (char) (sb.charAt(index) + 1));
				System.out.println(Encryption.hash(sb.toString()));
			}
			System.out.println();
		}
	}
	
	private static void sameByteValueTest() {
		String str = "";
		
		for (int i = 0; i < 1000; i++) {
			str += (char) ((int) (Math.random() * 90) + 32);
		}
		
		for (int i = 0; i < 1000; i++) {
			String temp = "";
			for (int j = 0; j < str.length(); j++) {
				if (j == i) {
					temp += (char) (str.getBytes()[j] + 1);
				} else {
					temp += str.charAt(j);
				}
			}
			System.out.println(Encryption.hash(temp));
		}
	}
	
	private static void uniformityTest() {
		ArrayList<CountableByte> bytes = new ArrayList<CountableByte>();
		ArrayList<CountableString> strings = new ArrayList<CountableString>();
		
		for (int i = 0; i < 1000; i++) {
			String hash = Encryption.hash(generateRandomString());
			
			// Count bytes
			for (byte b : hash.getBytes()) {
				if (!contains(bytes, b)) {
					CountableByte cb = new CountableByte();
					cb.count = 1;
					cb.value = b;
					bytes.add(cb);
				} else {
					getCountableByte(bytes, b).count++;
				}
			}
			
			// Count strings
			if (!contains(strings, hash)) {
				CountableString s = new CountableString();
				s.count = 1;
				s.value = hash;
				strings.add(s);
			} else {
				getCountableString(strings, hash).count++;
			}
		}
		
		Collections.sort(bytes);
		Collections.sort(strings);
		
		printStringStats(strings);
		System.out.println();
		printByteStats(bytes);
	}
	
	private static void printByteStats(ArrayList<CountableByte> bytes) {
		System.out.println("Bytes:");
		System.out.println("Least common: " + (char) bytes.get(0).value + "  :  " + bytes.get(0).count);
		System.out.println("Most common: " + (char) bytes.get(bytes.size() - 1).value + "  :  " + bytes.get(bytes.size() - 1).count);
		System.out.println("Median: " + (char) bytes.get(bytes.size() / 2).value + "  :  " + bytes.get(bytes.size() / 2).count);
		System.out.println();
		
		for (CountableByte s : bytes) {
			System.out.println((char) s.value + ":   " + s.count);
		}
	}
	
	private static void printStringStats(ArrayList<CountableString> strings) {
		System.out.println("Strings:");
		System.out.println("Least common: " + strings.get(0).value + "  :  " + strings.get(0).count);
		System.out.println("Most common: " + strings.get(strings.size() - 1).value + "  :  " + strings.get(strings.size() - 1).count);
		System.out.println("Median: " + strings.get(strings.size() / 2).value + "  :  " + strings.get(strings.size() / 2).count);
		System.out.println();
		
		for (CountableString s : strings) {
			System.out.println(s.value + ":   " + s.count);
		}
	}
	
	private static String generateRandomString() {
		int length = (int) (Math.random() * 100) + 1;
		String str = "";
		
		for (int i = 0; i < length; i++) {
			str += (char) ((int) (Math.random() * 94) + 32);
		}
		
		return str;
	}
	
	private static CountableByte getCountableByte(ArrayList<CountableByte> bytes, byte b) {
		for (CountableByte cb : bytes) {
			if (cb.value == b) {
				return cb;
			}
		}
		return null;
	}
	
	private static boolean contains(ArrayList<CountableByte> bytes, byte b) {
		for (CountableByte cb : bytes) {
			if (cb.value == b) {
				return true;
			}
		}
		return false;
	}
	
	private static CountableString getCountableString(ArrayList<CountableString> strings, String str) {
		for (CountableString s : strings) {
			if (s.value.equals(str)) {
				return s;
			}
		}
		return null;
	}
	
	private static boolean contains(ArrayList<CountableString> strings, String str) {
		for (CountableString s : strings) {
			if (s.value.equals(str)) {
				return true;
			}
		}
		return false;
	}
}
