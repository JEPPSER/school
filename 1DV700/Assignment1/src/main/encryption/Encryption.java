package main.encryption;

public interface Encryption {
	public String encrypt(String message, char key);
	public String decrypt(String message, char key);
}
