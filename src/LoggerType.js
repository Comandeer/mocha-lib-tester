import { Enumify } from 'enumify';

class LoggerType extends Enumify {}

LoggerType.LOG = new LoggerType();
LoggerType.ERROR = new LoggerType();

LoggerType.closeEnum();

export default LoggerType;
