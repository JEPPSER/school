package main.analysis;

public class CountableString implements Comparable<CountableString> {
	
	public String value;
	public int count;
	
	@Override
	public int compareTo(CountableString other) {
		int otherCount = (((CountableString) other).count);
		
		if (otherCount < count) {
			return 1;
		} else if (otherCount > count) {
			return -1;
		} else {
			return 0;
		}
	}
}
