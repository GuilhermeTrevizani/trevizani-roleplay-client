import Message from '../../types/Message';
import { useEffect, useRef, useState } from 'react';
import { Constants } from '../../../../src/base/constants';
import { Modal } from 'antd';
import { t } from 'i18next';
import './style.scss';
import { configureEvent, emitEvent, formatTime } from '../../services/util';
import { commands, CommandSuggestion } from './commands';
import toast, { Toaster } from 'react-hot-toast';

const ChatPage = ({ visiblePages }: { visiblePages: string[] }) => {
  const maxLength = 265;
  const extraLineHeight = 3;
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const [newMessages, setNewMessages] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [timeStampActive, setTimeStampActive] = useState(false);
  const [fontType, setFontType] = useState(0);
  const [fontSize, setFontSize] = useState(0);
  const [chatLines, setChatLines] = useState(0);
  const [lineHeight, setLineHeight] = useState(0);
  const [messagesListHeight, setMessagesListHeight] = useState(0);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmDescription, setConfirmDescription] = useState('');
  const [confirmFunction, setConfirmFunction] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('transparent');
  const chatActiveRef = useRef(false);
  const canInputRef = useRef(false);
  const typingRef = useRef(typing);
  const [commandsSuggestions, setCommandsSuggestions] = useState<CommandSuggestion[]>([]);

  const _MAX_INPUT_HISTORIES = 5;
  let inputHistoryCurrent = 0;
  let inputHistoryCache = '';

  const chatMessagesList = useRef(null);
  const chatInputBar = useRef(null);
  const scrollToEnd = useRef(false);
  const messagesListHeightRef = useRef(0);
  const lineHeightRef = useRef(0);

  const onScroll = () => {
    resetNewMessages();
  };

  const resetNewMessages = () => {
    if (newMessages)
      setTimeout(() => {
        if (getScrolledUpMessagesAmount() == 0) setNewMessages(false);
      }, 250);
  };

  const scrollMessagesList = (direction: string) => {
    const scrollTop = chatMessagesList.current.scrollTop;
    const pixels = lineHeightRef.current * 5;

    switch (direction) {
      case 'up':
        chatMessagesList.current.scrollTo({ top: scrollTop - pixels, behavior: 'smooth' });
        break;
      case 'down':
        chatMessagesList.current.scrollTo({ top: scrollTop + pixels, behavior: 'smooth' });
        break;
      case 'bottom':
        chatMessagesList.current.scrollTo({ top: chatMessagesList.current.scrollHeight });
        break;
    }

    resetNewMessages();
  }

  const getScrolledUpMessagesAmount = () => {
    const amount = Math.round((chatMessagesList.current.scrollHeight - chatMessagesList.current.scrollTop - messagesListHeightRef.current) / lineHeightRef.current);
    return (amount > 0) ? amount : 0;
  }

  useEffect(() => {
    messagesListHeightRef.current = messagesListHeight;
  }, [messagesListHeight]);

  useEffect(() => {
    lineHeightRef.current = lineHeight;
  }, [lineHeight]);

  const getFontName = () => {
    switch (fontType) {
      case 1:
        return "Georgia, 'Times New Roman', Times, serif";
      case 2:
        return "'Times New Roman', Times, serif";
      case 3:
        return "'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif";
      case 4:
        return "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
      case 5:
        return "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif";
      case 6:
        return "'Monospaced', sans-serif";
      default:
        return "Arial, Helvetica, sans-serif";
    }
  }

  const handleConfirmOk = () => {
    emitEvent(Constants.CHAT_PAGE_SHOW_CONFIRM_CONFIRM, confirmFunction);
    setConfirmTitle('');
  };

  const handleConfirmCancel = () => {
    emitEvent(Constants.CHAT_PAGE_SHOW_CONFIRM_CANCEL);
    setConfirmTitle('');
  };

  useEffect(() => {
    emitEvent(Constants.CHAT_PAGE_ACTIVE_INPUT, typing);
    typing ? chatInputBar.current.focus() : chatInputBar.current.blur();
    typingRef.current = typing;
    if (!typing)
      setText('');
  }, [typing]);

  useEffect(() => {
    chatActiveRef.current = visiblePages.includes(Constants.CHAT_PAGE);
    canInputRef.current = visiblePages.findIndex(x => x !== Constants.CHAT_PAGE && x !== Constants.PHONE_PAGE && x !== Constants.DEATH_PAGE) === -1;
    if (!canInputRef.current)
      setTyping(false);
  }, [visiblePages]);

  useEffect(() => {
    // const msgs = [];
    // for (let index = 0; index < 30; index++) {
    //   msgs.push({
    //     time: '13:30:30',
    //     color: 'white',
    //     message: 'Message ' + index,
    //   })
    // }
    // setMessages(msgs)
    // setTimeStampActive(false);
    // setFontType(0);
    // setFontSize(22);
    // setChatLines(20);
    // const lineHeightAux = 22 + extraLineHeight;
    // const messagesListHeightAux = 20 * (22 + extraLineHeight);
    // setLineHeight(lineHeightAux);
    // setMessagesListHeight(messagesListHeightAux);
    // scrollMessagesList('bottom');
    // chatActiveRef.current = true;
    // canInputRef.current = true;
    configureEvent(Constants.CHAT_PAGE_CONFIGURE, (timeStamp: boolean, fontType: number, fontSize: number, chatLines: number) => {
      setTimeStampActive(timeStamp);
      setFontType(fontType);
      setFontSize(fontSize);
      setChatLines(chatLines);
      const lineHeightAux = fontSize + extraLineHeight;
      const messagesListHeightAux = chatLines * lineHeightAux;
      setLineHeight(lineHeightAux);
      setMessagesListHeight(messagesListHeightAux);
      scrollMessagesList('bottom');
    });

    configureEvent(Constants.CHAT_PAGE_CLEAR_MESSAGES, () => {
      setMessages([]);
    });

    configureEvent(Constants.CHAT_PAGE_SEND_MESSAGE, (message: string, color: string) => {
      const scroll = getScrolledUpMessagesAmount();
      if (scroll < 4)
        scrollToEnd.current = true;
      setMessages(old => {
        if (old.length >= 100)
          old = old.slice(1);

        return [
          ...old,
          {
            message,
            color,
            time: formatTime(new Date())
          }
        ];
      });
    });

    configureEvent(Constants.CHAT_PAGE_NOTIFY, (message: string, type: string) => {
      toast(message,
        {
          style: {
            borderRadius: '10px',
            background: type === 'error' ? '#FF6A4D' : '#6EB469',
            color: '#fff',
            fontSize: '1.3vh',
          },
        }
      );
    });

    configureEvent(Constants.CHAT_PAGE_SHOW_CONFIRM, (title: string, description: string, functionName: string) => {
      setConfirmDescription(description);
      setConfirmFunction(functionName);
      setConfirmTitle(title);
    });

    configureEvent(Constants.CHAT_PAGE_TOGGLE_SCREEN, (backgroundColor: string) => {
      setBackgroundColor(backgroundColor);
    });

    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);

    return () => {
      document.removeEventListener('keydown', keyDown);
      document.removeEventListener('keyup', keyUp);
    };
  }, []);

  const keyDown = (e: KeyboardEvent) => {
    if ((e.code.toUpperCase() === 'SPACE' || e.key === ' ') && !typingRef.current && !checkIfIsInput(e))
      e.preventDefault();
    else if (e.code.toUpperCase() === 'HOME' || e.code.toUpperCase() === 'END')
      e.preventDefault();
  };

  const keyUp = (e: KeyboardEvent) => {
    if (!chatActiveRef.current) {
      e.preventDefault();
      return;
    }

    if (canInputRef.current) {
      if (e.key.toUpperCase() === 'PAGEDOWN') {
        scrollMessagesList('down');
      } else if (e.key.toUpperCase() === 'PAGEUP') {
        scrollMessagesList('up');
      }
    }

    if (typingRef.current) {
      if (e.key.toUpperCase() === 'ENTER') {
        setTyping(false);
        const currentText = chatInputBar.current.value.trim();
        if (currentText.length == 0)
          return;

        scrollMessagesList('bottom');
        emitEvent(Constants.CHAT_PAGE_SEND_INPUT, currentText);
        const newHistory = history;
        if (newHistory.length >= _MAX_INPUT_HISTORIES)
          newHistory.shift();

        newHistory.push(currentText);
        setHistory(newHistory);
      } else if (e.key.toUpperCase() === 'ARROWUP') {
        const current = inputHistoryCurrent;
        if (inputHistoryCurrent == history.length) inputHistoryCache = text;

        if (current > 0) {
          inputHistoryCurrent--;
          setText(history[inputHistoryCurrent]);
        }
      } else if (e.key.toUpperCase() === 'ARROWDOWN') {
        if (inputHistoryCurrent == history.length) return;
        if (inputHistoryCurrent < history.length - 1) {
          inputHistoryCurrent++;
          setText(history[inputHistoryCurrent]);
        } else {
          inputHistoryCurrent = history.length;
          setText(inputHistoryCache);
        }
      } else if (e.key.toUpperCase() === 'ESCAPE') {
        setTyping(false);
      }
    } else if (canInputRef.current) {
      if (e.key.toUpperCase() === 'T' && !checkIfIsInput(e)) {
        inputHistoryCache = '';
        inputHistoryCurrent = history.length;
        setTyping(true);
      }
    }

    e.preventDefault();
  };

  const checkIfIsInput = (e: KeyboardEvent) => {
    const name = (e.target as HTMLElement).tagName.toLowerCase();
    return ['input', 'textarea', 'select'].includes(name);
  }

  useEffect(() => {
    const scroll = getScrolledUpMessagesAmount();
    (scroll >= 4 && !scrollToEnd.current) ? setNewMessages(true) : scrollMessagesList('bottom');
    scrollToEnd.current = false;
  }, [messages, chatLines, lineHeight]);

  useEffect(() => {
    const command = (text ?? '').split(' ')[0]?.toLowerCase();
    if (!command || !command.startsWith('/') || command.length < 2) {
      setCommandsSuggestions([]);
      return;
    }

    const hasSpace = text.includes(' ');

    setCommandsSuggestions(commands.filter(x =>
      hasSpace ?
        x.command.toLowerCase().split(' ')[0] === command.toLowerCase()
        :
        x.command.toLowerCase().startsWith(command))
      .slice(0, 3)
    );
  }, [text]);

  return <div>
    <Toaster
      position="bottom-right"
      reverseOrder={false}
    />
    <div className='chatPage' style={{
      backgroundColor: backgroundColor,
      display: visiblePages.includes(Constants.CHAT_PAGE) ? 'block' : 'none'
    }}>
      <div style={{
        userSelect: 'none', WebkitTouchCallout: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none', outline: 'none',
        width: '40%',
        fontSize: `${fontSize}px`, fontFamily: getFontName(), fontWeight: 'bold', letterSpacing: '0.4px',
        textShadow: '0 0 0.1em black, 0 0 0.1em black, 0 0 0.1em black, 0 0 0.1em black',
        zIndex: 0,
        padding: '5px 0 0 5px',
      }}>
        <div ref={chatMessagesList} style={{
          userSelect: 'none', WebkitTouchCallout: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none', outline: 'none',
          overflow: typing ? 'overlay' : 'hidden',
          height: `${messagesListHeight}px`, maxHeight: `${messagesListHeight}px`
        }} onScroll={onScroll}>
          {messages.map(message => (
            <div style={{
              paddingLeft: '2px', lineHeight: `${lineHeight}px`, display: 'flex', flexDirection: 'row', color: message.color,
            }}>
              <div className='timestamp' style={{ display: timeStampActive ? 'inline' : 'none' }}>[{message.time}]</div>
              <div style={{ marginLeft: '3px' }} dangerouslySetInnerHTML={{ __html: message.message }} />
            </div>
          ))}
        </div>
        <input ref={chatInputBar} type="text" spellCheck="false" autoComplete="off" maxLength={maxLength} style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', width: '90%', outline: 'none', border: 'none', height: '40px',
          padding: '0 10px 0 10px', marginTop: '10px', visibility: typing ? 'visible' : 'hidden',
        }} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => {
          if (e.code.toUpperCase() === 'TAB')
            e.preventDefault();
        }} />
        <span style={{ color: 'white', marginLeft: '5px', visibility: typing ? 'visible' : 'hidden' }}>{text.length}/{maxLength}</span>
        <div style={{
          color: 'rgb(255, 255, 0)', paddingLeft: '2px', visibility: newMessages ? 'visible' : 'hidden',
          transition: 'visibility 0.15s linear, opacity 0.15s linear'
        }}>
          <i></i>{t('thereAreNewMessages')}
        </div>
        <div>
          {commandsSuggestions.map(command => (
            <div className='commandSuggestion'>
              <strong>{command.command}</strong> <br />
              {command.description}
            </div>
          ))}
        </div>
      </div>

      <Modal title={confirmTitle} open={confirmTitle != ''} onOk={handleConfirmOk} onCancel={handleConfirmCancel}
        cancelText={t('no')} okText={t('yes')} closable={false}>
        <p>{confirmDescription}</p>
      </Modal>
    </div>
  </div>
};

export default ChatPage;