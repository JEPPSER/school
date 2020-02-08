package main.analysis;

public class CountableByte implements Comparable<CountableByte> {
	
	public byte value;
	public int count;
	
	@Override
	public int compareTo(CountableByte other) {
		int otherCount = (((CountableByte) other).count);
		
		if (otherCount < count) {
			return 1;
		} else if (otherCount > count) {
			return -1;
		} else {
			return 0;
		}
	}
}
