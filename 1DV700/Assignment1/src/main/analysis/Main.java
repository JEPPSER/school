package main.analysis;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;

public class Main {

	public static void main(String[] args) {
		try {
			String str = new String(Files.readAllBytes(Paths.get("John Herrlin Sub.txt")));
			ArrayList<CountableByte> bytes = new ArrayList<CountableByte>();
			
			byte lowest = str.getBytes()[0];
			byte highest = str.getBytes()[0];
			
			for (byte b : str.getBytes()) {
				if (b < lowest) {
					lowest = b;
				}
				if (b > highest) {
					highest = b;
				}
				if (!contains(bytes, b)) {
					CountableByte cb = new CountableByte();
					cb.value = b;
					cb.count = 1;
					bytes.add(cb);
				} else {
					getCountableByte(bytes, b).count++;
				}
			}
			
			for (CountableByte cb : bytes) {
				System.out.println((char) cb.value + "   count: " + cb.count + "   freq: " + (Math.round((1000 * ((double) cb.count / str.length()))) / 10f) + "%");
			}
			
			System.out.println("lowest: " + lowest + "    highest: " + highest);
		} catch (IOException e) {
			e.printStackTrace();
		}
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
}
