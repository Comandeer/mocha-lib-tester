import { Enumify } from 'enumify';

class LoggerColor extends Enumify {}

LoggerColor.AUTO = new LoggerColor();
LoggerColor.BLUE = new LoggerColor();
LoggerColor.YELLOW = new LoggerColor();
LoggerColor.GREEN = new LoggerColor();
LoggerColor.RED = new LoggerColor();

LoggerColor.closeEnum();

export default LoggerColor;
