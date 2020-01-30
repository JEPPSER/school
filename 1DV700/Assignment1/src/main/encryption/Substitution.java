package main.encryption;

public class Substitution implements Encryption {

	@Override
	public String encrypt(String message, char key) {
		String result = "";
		for (byte b : message.getBytes()) {
			int tempByte = ((int) b ^ (int) key);
			result += (char) tempByte;
		}
		return result;
	}

	@Override
	public String decrypt(String message, char key) {
		String result = "";
		for (byte b : message.getBytes()) {
			int tempByte = ((int) b ^ (int) key);
			result += (char) tempByte;
		}
		return result;
	}
}
