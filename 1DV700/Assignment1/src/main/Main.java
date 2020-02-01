package main;

import main.encryption.Encryption;

public class Main {
	
	public static void main(String[] args) {
		
		// substitution
		String encrypted = Encryption.subEncrypt("hello world! It is very nice to be here. Thanks for having me!", (char) 65);
		System.out.println(encrypted);
		System.out.println(Encryption.subDecrypt(encrypted, (char) 65));
		
		System.out.println();
		
		// transposition
		encrypted = Encryption.transEncrypt("We are discovered flea at once!! haha aa de ere", "zebra");
		System.out.println(encrypted);
		System.out.println(Encryption.transDecrypt(encrypted, "zebra"));
	}
}
