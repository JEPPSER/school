package main;

import main.encryption.Substitution;

public class Main {
	
	public static void main(String[] args) {
		Substitution s = new Substitution();
		String encrypted = s.encrypt("hello world! It is very nice to be here. Thanks for having me!", (char) 65);
		System.out.println(encrypted);
		System.out.println(s.decrypt(encrypted, (char) 65));
	}
}
