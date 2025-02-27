import moment from 'moment';

export const removeAccents = (text?: string) => {
  return (text ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
};

export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export const formatValue = (value: number, digits: number = 0) => {
  return value.toLocaleString('pt-br', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export const configureEvent = (eventName: string, listener: (...args: any[]) => void) => {
  if ('mp' in window) {
    mp.events.remove(eventName);
    mp.events.add(eventName, listener);
  }
};

export const emitEvent = (eventName: string, ...args: any[]) => {
  if ('mp' in window)
    mp.trigger(eventName, ...args);
};

export const formatDateTime = (date: Date) => {
  return moment(date).format('DD/MM/yyyy HH:mm:ss');
}

export const formatDate = (date: Date) => {
  return moment(date).format('DD/MM/yyyy');
}

export const formatTime = (date: Date) => {
  return moment(date).format('HH:mm:ss');
}