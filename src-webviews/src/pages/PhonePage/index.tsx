import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'
import './styles.scss'
import iphoneShape from '../../assets/Iphone.png'
import camera from '../../assets/camera.png'
import bg from '../../assets/bg-phone.jpg'
import settingsIcon from '../../assets/phoneSettingsIcon.png'
import phoneIcon from '../../assets/phone.png'
import messagesIcon from '../../assets/messages.png'
import {
  CheckOutlined, CloseOutlined, DeleteOutlined, EnvironmentOutlined, LeftOutlined, PlusOutlined,
  SendOutlined, StarFilled, StarOutlined, ZoomInOutlined, ZoomOutOutlined
} from '@ant-design/icons'
import {
  AirPlaneIcon, BackSpaceIcon, SignalIcon, ContactsIcon, FavoriteIcon, GroupIcon, InfoIcon, KeyPadIcon, LockIcon,
  MessageIcon, NewChatIcon, PasscodeIcon, PersonIcon, PhoneEndCallIcon, PhoneIcon, PhoneMadeIcon,
  PhoneReceivedIcon, RecentsIcon, SearchIcon, SoundsIcon, VolumeMaxIcon, VolumeMinIcon, WallpaperIcon
} from '../../assets/svg'
import { configureEvent, emitEvent, formatDateTime, removeAccents } from '../../services/util'
import { Constants } from '../../../../src/base/constants'
import moment, { tz } from 'moment-timezone'
import 'moment/dist/locale/pt-br'

export default function PhonePage() {
  interface PhoneContact {
    number?: number
    name: string
    favorite: boolean
    blocked: boolean
  }

  interface PhoneCall {
    origin: number
    number: number
    registerDate: Date
    type: PhoneCallType
  }

  enum PhoneCallType {
    Lost = 1,
    Answered = 2,
  }

  interface PhoneLastMessage {
    number: number
    phoneGroupId?: string
    registerDate: Date
    title: string
    message: string
    read: boolean
    id: string
  }

  interface PhoneGroup {
    id: string
    name: string
    users: PhoneGroupUser[]
    joinDate: Date
  }

  interface PhoneGroupUser {
    number: number
    permission: PhoneGroupUserPermission
  }

  enum PhoneGroupUserPermission {
    User = 1,
    Admin = 2,
  }

  interface PhoneChat {
    identifier: string
    participants: PhoneChatParticipant[]
    isGroup: boolean
    isAdmin: boolean
  }

  interface PhoneChatParticipant {
    number: number
    name: string
    permission: PhoneGroupUserPermission
  }

  interface PhoneChatMessage {
    from: string
    text: string
    date: Date
    type: PhoneMessageType
    read: boolean
    id: string
    locationX: number
    locationY: number
  }

  enum PhoneMessageType {
    Text = 1,
    Location = 2,
  }

  const [page, setPage] = useState<
    'lock' |
    'passcode' |
    'home' |
    'settings' |
    'settings:sounds' |
    'settings:wallpaper' |
    'settings:password' |
    'settings:password:newPassword' |
    'messages' |
    'messages:new:options' |
    'messages:new' |
    'messages:chat' |
    'messages:chat:detail' |
    'messages:chat:addMembers' |
    'phone' |
    'phone:favorite' |
    'phone:contacts' |
    'phone:contacts:contact' |
    'phone:contacts:newContact' |
    'phone:keypad' |
    'phone:keypad:call' |
    'call' |
    'settings:scale'
  >('lock')

  const changePage = (to: typeof page) => {
    activePageRef.current.className = activePageRef.current.className.replace('show', 'fadeOut')
    setPage(to)
  }

  const [loading, setLoading] = useState(false)

  const statusBarTranslucent = Boolean(page == 'home' || page == 'passcode' || page == 'lock' || page == 'phone:keypad:call' || page == 'call')
  const statusBarContactDetail = page == 'phone:contacts:contact'
  const isPhonePage =
    Boolean(
      page == 'phone' ||
      page == 'phone:favorite' ||
      page == 'phone:contacts' ||
      page == 'phone:keypad'
    )

  const formatTime = (date: Date) => {
    const momentDate = moment(date)
    const currentDate = moment()
    const days = currentDate.diff(momentDate, 'days')
    if (days === 0)
      return momentDate.format('HH:mm')

    if (days === 1)
      return 'ontem'

    return momentDate.format('DD/MM/yyyy')
  }

  //refs
  const activePageRef = useRef<HTMLDivElement>(undefined)
  //

  useEffect(() => {
    document.addEventListener('keydown', keyDown)

    return () => {
      document.removeEventListener('keydown', keyDown)
    }
  }, [])

  const keyDown = (e: KeyboardEvent) => {
    if (e.key.toUpperCase() === 'ESCAPE')
      emitEvent(Constants.PHONE_PAGE_CLOSE)
  }

  // #region lockScreen
  const handleUnlock = () => {
    changePage(hasPassword() ? 'passcode' : 'home')
  }
  // #endregion

  // #region passCodeScreen
  const passcodeIndicatorRef = useRef<HTMLDivElement>(undefined)
  const [passcode, setPassCode] = useState('')
  const [password, setPassword] = useState('')

  const handleUpdatePasscode = (val: string) => {
    const newPassCode = passcode + val
    setPassCode(newPassCode)
    if (newPassCode.length == 4) {
      if (newPassCode == password) {
        changePage('home')
      } else {
        passcodeIndicatorRef.current.className = 'passcodeScreenPassContainer'
        setTimeout(() => {
          passcodeIndicatorRef.current.className = 'passcodeScreenPassContainer bounce'
        }, 1)
      }

      setPassCode('')
    }
  }

  const handleBackspacePasscode = () => {
    if (passcode.length >= 1) {
      setPassCode(old => old.substring(0, old.length - 1))
    }
  }

  const hasPassword = () => {
    return password != ''
  }
  // #endregion

  // #region homeScreen
  const handleOpenSettings = () => {
    changePage('settings')
  }
  const handleOpenPhone = () => {
    changePage('phone')
  }
  const handleOpenMessages = () => {
    changePage('messages')
  }

  const handleBackHome = () => {
    changePage('home')
  }
  // #endregion

  // #region settingsScreen
  const [flightMode, setFlightMode] = useState(false)
  const handleToggleFlightMode = () => {
    setFlightMode(old => !old)
  }

  const handleSubMenuSounds = () => {
    changePage('settings:sounds')
  }
  const handleSubMenuPassword = () => {
    changePage('settings:password')
  }

  const handlebackToSettings = () => {
    changePage('settings')
  }
  // #endregion

  // #region settings:sounds
  const [ringtoneVolume, setRingtoneVolume] = useState(100)
  // #endregion

  // #region settings:wallpaper
  const [wallpaper, setWallpaper] = useState<string>('')
  const inputWallpaperRef = useRef<HTMLInputElement>(undefined)

  const saveTimeoutRef = useRef(null)
  const [scale, setScale] = useState(50)

  useEffect(() => {
    if (saveTimeoutRef.current)
      clearTimeout(saveTimeoutRef.current)

    saveTimeoutRef.current = setTimeout(() => {
      emitEvent(Constants.PHONE_PAGE_SAVE_SETTINGS, flightMode, wallpaper, password, ringtoneVolume, scale)
      saveTimeoutRef.current = null
    }, 1000)
  }, [flightMode, wallpaper, password, ringtoneVolume, scale])

  const handleChangeWallpaper = () => {
    checkImageUrl(inputWallpaperRef.current.value).then((isValid) => {
      if (isValid) {
        setWallpaper(inputWallpaperRef.current.value)
      }
    })
  }

  const checkImageUrl = async (url: string) => {
    return new Promise<boolean>((resolve, reject) => {
      if (url.trim() == '') {
        resolve(true)
      }
      if (!url.startsWith('https://i.imgur.com/')) {
        inputWallpaperRef.current.value = ''
        resolve(true)
      }
      fetch(url).then(res => {
        const img = new Image()
        img.src = url
        img.onload = () => {
          if (res.status == 200 && !(img.width == 0)) {
            resolve(true)
          } else {
            resolve(false)
          }
        }
      })
        .catch(e => {
          resolve(false)
        })
    })
  }
  // #endregion

  // #region settings:password
  const handleOpenNewPassword = () => {
    changePage('settings:password:newPassword')
  }
  // #endregion

  // #region settings:password:new
  const [newPassword, setNewPassword] = useState('')

  const handleAddDigitToNewPassword = (digit: string) => {
    if (newPassword.length <= 3) {
      setNewPassword(x => x + digit)
    }
  }

  const handleBackspaceNewPassword = () => {
    if (newPassword.length >= 1) {
      setNewPassword(old => old.substring(0, old.length - 1))
    }
  }

  useEffect(() => {
    if (newPassword.length == 4) {
      setPassword(newPassword)
      setNewPassword('')
      changePage('settings:password')
    }
  }, [newPassword])
  // #endregion

  // #region messages
  const [lastMessages, setLastMessages] = useState<PhoneLastMessage[]>([])
  const [groups, setGroups] = useState<PhoneGroup[]>([])
  const [searchLastMessage, setSearchLastMessage] = useState('')
  const [searchedLastMessages, setSearchedLastMessages] = useState<PhoneLastMessage[]>([])
  const [phoneContactList, setPhoneContactList] = useState<PhoneContact[]>([])
  const [currentChatMessages, setCurrentChatMessages] = useState<PhoneChatMessage[]>()

  useEffect(() => {
    if (page === 'messages:chat' || page === 'messages:chat:detail' || page === 'messages:chat:addMembers')
      handleOpenChat(chat.identifier, false)
  }, [lastMessages])

  useEffect(() => {
    if (searchLastMessage.length == 0) {
      setSearchedLastMessages(lastMessages)
    } else {
      const filtered = lastMessages.filter(x => x.title.toUpperCase().includes(searchLastMessage.toUpperCase())
        || x.message.toUpperCase().includes(searchLastMessage.toUpperCase()))
      setSearchedLastMessages(filtered)
    }

  }, [lastMessages, searchLastMessage])

  const handleOpenNewMessageOptions = () => {
    changePage('messages:new:options')
  }

  const handleOpenChat = (numberOrGroupId: string, resetMessageText = true) => {
    if (resetMessageText)
      setMessageText('')

    setCurrentChatMessages([])
    const number = Number(numberOrGroupId)
    if (isNaN(number)) { // GROUP
      const group = groups.find(x => x.id === numberOrGroupId)

      setChat({
        identifier: group.id,
        participants: group.users.map(x => ({
          name: getContactName(x.number),
          number: x.number,
          permission: x.permission,
        })),
        isGroup: true,
        isAdmin: group.users.findIndex(x => x.number === cellphone && x.permission === PhoneGroupUserPermission.Admin) !== -1,
      })
      emitEvent(Constants.PHONE_PAGE_UPDATE_CHAT_MESSAGES, group.id, true)
    } else { // USER
      const contactName = getContactName(number)

      setChat({
        identifier: number.toString(),
        participants: [{
          name: contactName,
          number: number,
          permission: PhoneGroupUserPermission.User,
        }],
        isGroup: false,
        isAdmin: false,
      })
      emitEvent(Constants.PHONE_PAGE_UPDATE_CHAT_MESSAGES, number.toString(), false)
    }

    if (page !== 'messages:chat')
      changePage('messages:chat')
  }
  // #endregion

  // #region messages:new:options
  const [newMessageOptionsContactsResult, setNewMessageOptionsContactsResult] = useState<PhoneContact[]>(phoneContactList)
  const [newMessageSearch, setNewMessageSearch] = useState('')

  useEffect(() => {
    if (newMessageSearch == '') {
      setNewMessageOptionsContactsResult(phoneContactList)
      return
    }

    const newSearch = removeAccents(newMessageSearch)
    const filteredItems = phoneContactList.filter(x =>
      x.number.toString().includes(newSearch) || removeAccents(x.name).includes(newSearch)
    )
    setNewMessageOptionsContactsResult(filteredItems)

  }, [phoneContactList, newMessageSearch])
  // #endregion

  // #region messages:new
  const [newMessageContactsResult, setNewMessageContactsResult] = useState<PhoneContact[]>([])
  const [newMessageSelectedContacts, setNewMessageSelectedContacts] = useState<PhoneContact[]>([])

  const newMessageContactInputRef = useRef<HTMLInputElement>(undefined)
  const [newMessageGroupName, setNewMessageGroupName] = useState('')

  const handleCreateNewGroup = () => {
    if (loading)
      return

    setLoading(true)
    emitEvent(Constants.PHONE_PAGE_CREATE_GROUP,
      newMessageGroupName,
      JSON.stringify(newMessageSelectedContacts.map(x => x.number)))
  }

  const handleAddContactToMessage = (number: number) => {
    var res = newMessageContactsResult.filter(x => x.number == number)

    if (res)
      setNewMessageSelectedContacts(old => [...old, res[0]])

    handleClearMessageContactInput()
  }

  const handleRemoveContactToMessage = (number: number) => {
    setNewMessageSelectedContacts(old => old.filter(x => x.number !== number))

    handleClearMessageContactInput()
  }

  const searchMessageContacts = (value: string) => {
    const res = value.length < 1 ? [] :
      phoneContactList.filter(x => x.name.toUpperCase().includes(value.toUpperCase()) && !newMessageSelectedContacts.find(y => y.number == x.number))

    setNewMessageContactsResult(res)
  }

  const handleClearMessageContactInput = () => {
    newMessageContactInputRef.current.value = ''
    setNewMessageContactsResult([])
  }
  // #endregion

  // #region messages:chat
  const [messageText, setMessageText] = useState('')

  const [chat, setChat] = useState<PhoneChat>({
    identifier: '',
    participants: [],
    isGroup: false,
    isAdmin: false,
  })

  const handleTextKeyDown = (e) => {
    if (e.key.toUpperCase() === 'ENTER')
      handleSendMessage()
  }

  const handleSendMessage = () => {
    emitEvent(Constants.PHONE_PAGE_SEND_MESSAGE, chat.identifier, messageText)
    setMessageText('')
  }

  const handleExitMessageGroup = () => {
    if (loading)
      return

    setLoading(true)
    emitEvent(Constants.PHONE_PAGE_EXIT_GROUP, chat.identifier)
    changePage('messages')
  }

  const handleToggleUserGroupPermission = (number: number) => {
    if (loading)
      return

    setLoading(true)
    emitEvent(Constants.PHONE_PAGE_TOGGLE_GROUP_MEMBER_PERMISSION, chat.identifier, number)
  }

  const handleRemoveUserGroup = (number: number) => {
    if (loading)
      return

    setLoading(true)
    emitEvent(Constants.PHONE_PAGE_REMOVE_GROUP_MEMBER, chat.identifier, number)
  }

  const handleAddMembers = () => {
    if (loading || newMessageSelectedContacts.length == 0)
      return

    setLoading(true)
    emitEvent(Constants.PHONE_PAGE_ADD_GROUP_MEMBERS, chat.identifier, JSON.stringify(newMessageSelectedContacts.map(x => x.number)))
  }

  const handleBackToChat = () => {
    changePage('messages:chat')
  }

  const handleOpenGroupDetail = () => {
    if (chat.isGroup)
      changePage('messages:chat:detail')
  }
  // #endregion

  // #region Phone
  const [phoneHistory, setPhoneHistory] = useState<PhoneCall[]>([])

  const [searchedPhoneContactList, setSearchedPhoneContactList] = useState<PhoneContact[]>([])
  const [searchContact, setSearchContact] = useState('')

  const [currentContact, setCurrentContact] = useState<PhoneContact>({
    name: '',
    number: 0,
    favorite: false,
    blocked: false,
  })

  let currentContactNumberRef = useRef(0)

  useEffect(() => {
    currentContactNumberRef.current = currentContact.number
  }, [currentContact])

  const [time, setTime] = useState(tz("America/Sao_Paulo").locale('pt-br').format("HH:mm"))
  const [date, setDate] = useState(tz("America/Sao_Paulo").locale('pt-br').format("ddd, DD [de] MMMM"))
  const [cellphone, setCellphone] = useState(0)
  const [callContact, setCallContact] = useState('')
  const [callTime, setCallTime] = useState(0)
  const callInterval = useRef(null)

  const formatCallTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  useLayoutEffect(() => {
    // setScale(70)
    // setPhoneHistory([
    //   {
    //     origin: 9999999,
    //     number: 1111111,
    //     registerDate: new Date('11/11/2024 13:58'),
    //     type: PhoneCallType.Lost,
    //   },
    //   {
    //     origin: 9999999,
    //     number: 1111111,
    //     registerDate: new Date('11/11/2024 13:56'),
    //     type: PhoneCallType.Answered,
    //   },
    //   {
    //     origin: 2222222,
    //     number: 9999999,
    //     registerDate: new Date('11/11/2024 13:34'),
    //     type: PhoneCallType.Lost,
    //   },
    //   {
    //     origin: 2222222,
    //     number: 9999999,
    //     registerDate: new Date('11/11/2024 13:30'),
    //     type: PhoneCallType.Answered,
    //   },
    // ])
    // setPhoneContactList([{
    //   name: 'Benny Veneruso',
    //   number: 1111111,
    //   favorite: true,
    //   blocked: false,
    // }, {
    //   name: 'Fuinha',
    //   number: 2222222,
    //   favorite: true,
    //   blocked: false,
    // }, {
    //   name: 'Tony Vica',
    //   number: 3333333,
    //   favorite: false,
    //   blocked: false,
    // }, {
    //   name: 'Isis Marano',
    //   number: 4444444,
    //   favorite: false,
    //   blocked: false,
    // }, {
    //   name: 'Frank Sopro',
    //   number: 5555555,
    //   favorite: false,
    //   blocked: false,
    // }, {
    //   name: 'Frank Bruno',
    //   number: 6666666,
    //   favorite: false,
    //   blocked: false,
    // }])
    // setGroups([{
    //   id: '1-1',
    //   name: 'Safadas de Vinewood',
    //   joinDate: new Date(),
    //   users: [{
    //     number: 1111111,
    //     permission: 1,
    //   }, {
    //     number: 2222222,
    //     permission: 1,
    //   }, {
    //     number: 9999999,
    //     permission: PhoneGroupUserPermission.Admin,
    //   }]
    // }])
    // setCellphone(9999999)
    configureEvent(Constants.PHONE_PAGE_SHOW, (cellphone: number, flightMode: boolean, wallpaper: string, password: string,
      ringtoneVolume: number, scale: number) => {
      setCellphone(cellphone)
      setFlightMode(flightMode)
      setWallpaper(wallpaper)
      setPassword(password)
      setRingtoneVolume(ringtoneVolume)
      setScale(scale)
    })

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false)
    })

    configureEvent(Constants.PHONE_PAGE_UPDATE_INFO, (temperature: number, weatherType: string) => {
      setTime(tz("America/Sao_Paulo").locale('pt-br').format("HH:mm"))
      setDate(tz("America/Sao_Paulo").locale('pt-br').format("ddd, DD [de] MMMM"))
    })

    configureEvent(Constants.PHONE_PAGE_UPDATE_CONTACTS, (contactsJson: string) => {
      const contacts = JSON.parse(contactsJson)
      const newCurrentContact = contacts.find(x => x.number === currentContactNumberRef.current)
      if (newCurrentContact)
        setCurrentContact(newCurrentContact)
      setPhoneContactList(contacts)
    })

    configureEvent(Constants.PHONE_PAGE_UPDATE_CALLS, (callsJson: string) => {
      setPhoneHistory(JSON.parse(callsJson))
    })

    configureEvent(Constants.PHONE_PAGE_UPDATE_LAST_MESSAGES, (lastMessagesJson: string) => {
      setLastMessages(JSON.parse(lastMessagesJson))
    })

    configureEvent(Constants.PHONE_PAGE_UPDATE_GROUPS, (groupsJson: string) => {
      setGroups(JSON.parse(groupsJson))
    })

    configureEvent(Constants.PHONE_PAGE_CALL_CONTACT, (contact: string) => {
      if (callInterval.current) {
        clearInterval(callInterval.current)
        callInterval.current = null
      }

      setCallContact(contact)
      setCallTime(0)
      changePage('phone:keypad:call')
    })

    configureEvent(Constants.PHONE_PAGE_ANSWER_CALL, (contact: string) => {
      setCallContact(contact)

      if (callInterval.current) {
        clearInterval(callInterval.current)
        callInterval.current = null
      }

      callInterval.current = setInterval(() => {
        setCallTime(value => value + 1)
      }, 1000)

      changePage('phone:keypad:call')
    })

    configureEvent(Constants.PHONE_PAGE_END_CALL, () => {
      returnPageEndCall()
    })

    configureEvent(Constants.PHONE_PAGE_RECEIVE_CALL, (contact: string) => {
      setCallContact(contact)
      changePage('call')
    })

    configureEvent(Constants.PHONE_PAGE_CREATE_GROUP, () => {
      setNewMessageSelectedContacts([])
      setNewMessageGroupName('')
      page === 'messages:chat:addMembers' ? changePage('messages:chat:detail') : changePage('messages')
    })

    configureEvent(Constants.PHONE_PAGE_UPDATE_CHAT_MESSAGES, (messagesJson: string) => {
      setCurrentChatMessages(JSON.parse(messagesJson))
    })

    emitEvent(Constants.PHONE_PAGE_SHOW)
  }, [])

  const [keypadNumber, setKeypadNumber] = useState('')

  const handleOpenPhoneRecents = () => {
    setPage('phone')
  }
  const handleOpenPhoneFavorite = () => {
    setPage('phone:favorite')
  }
  const handleOpenPhoneContacts = () => {
    setPage('phone:contacts')
  }
  const handleOpenPhoneKeypad = () => {
    setPage('phone:keypad')
  }

  const handleOpenNewContact = (item: PhoneContact) => {
    setNewContactNameInput(item.name)
    setNewContactNumberInput(item.number)
    changePage('phone:contacts:newContact')
  }

  const handleOpenContactDetail = (item: PhoneContact) => {
    setCurrentContact(item)
    changePage('phone:contacts:contact')
  }

  const handleAddKeypadNumber = (val: string) => {
    setKeypadNumber(old => old + val)
  }
  const handleRemoveKeypadNumber = () => {
    if (keypadNumber.length > 0)
      setKeypadNumber(old => old.substring(0, old.length - 1))
  }

  useEffect(() => {
    if (searchContact == '') {
      setSearchedPhoneContactList(phoneContactList)
      return
    }

    const newSearch = removeAccents(searchContact)
    const filteredItems = phoneContactList.filter(x =>
      x.number.toString().includes(newSearch) || removeAccents(x.name).includes(newSearch)
    )
    setSearchedPhoneContactList(filteredItems)

  }, [phoneContactList, searchContact])
  // #endregion

  // #region Phone:newContact
  const [newContactNameInput, setNewContactNameInput] = useState('')
  const [newContactNumberInput, setNewContactNumberInput] = useState(0)

  const handleBackToPhoneContacts = () => {
    changePage('phone:contacts')
  }

  const handleSaveContact = () => {
    emitEvent(Constants.PHONE_PAGE_CREATE_UPDATE_CONTACT, newContactNumberInput, newContactNameInput,
      currentContact.number == newContactNumberInput ? currentContact.favorite : false,
      currentContact.number == newContactNumberInput ? currentContact.blocked : false)
    handleBackToPhoneContacts()
  }

  const toggleCurrentContactFavorite = (state: boolean) => {
    emitEvent(Constants.PHONE_PAGE_CREATE_UPDATE_CONTACT, currentContact.number, currentContact.name, state, currentContact.blocked)
  }

  const toggleCurrentContactBlocked = (state: boolean) => {
    emitEvent(Constants.PHONE_PAGE_CREATE_UPDATE_CONTACT, currentContact.number, currentContact.name, currentContact.favorite, state)
  }
  // #endregion

  // #region Phone:ContactDetail
  const handleEditContact = () => {
    handleOpenNewContact(currentContact)
  }
  // #endregion

  // #region Phone:Keypad:call
  const handleEndCall = () => {
    emitEvent(Constants.PHONE_PAGE_END_CALL)
    returnPageEndCall()
  }

  const handleAcceptCall = () => {
    emitEvent(Constants.PHONE_PAGE_ANSWER_CALL)
  }

  const returnPageEndCall = () => {
    changePage('phone:keypad')
  }
  // #endregion

  const sendLocation = (numberOrGroup: string) => {
    emitEvent(Constants.PHONE_PAGE_SEND_LOCATION, numberOrGroup)
  }

  const deleteContact = () => {
    emitEvent(Constants.PHONE_PAGE_REMOVE_CONTACT, currentContact.number)
    handleBackToPhoneContacts()
  }

  const callNumber = (number: number) => {
    emitEvent(Constants.PHONE_PAGE_CALL_CONTACT, number)
  }

  const getContactName = (number: number) => {
    if (number === cellphone)
      return 'Você'

    return phoneContactList.find(x => x.number === number)?.name ?? number.toString()
  }

  const openContactByNumber = (number: number) => {
    const contact = phoneContactList.find(x => x.number === number)
    if (contact)
      handleOpenContactDetail(contact)
    else
      handleOpenNewContact({ name: '', number, favorite: false, blocked: false })
  }

  useEffect(() => {
    if (page !== 'messages:chat')
      return;

    const messagesIds = currentChatMessages.filter(x => !x.read).map(x => x.id)
    if (messagesIds.length === 0)
      return

    setLastMessages(old => {
      const updatedMessages = old.map(message => {
        if (messagesIds.includes(message.id))
          return { ...message, read: true }

        return message
      })

      return updatedMessages
    })
    emitEvent(Constants.PHONE_PAGE_READ_MESSAGES, JSON.stringify(messagesIds))
  }, [currentChatMessages])

  const trackLocation = (x: number, y: number) => {
    emitEvent(Constants.PHONE_PAGE_TRACK_LOCATION, x, y)
  }

  return (
    <div id='phonePage' style={{ zoom: `${scale}%` }}>
      <div className='phoneContainer slideUp'>
        <div className={'screen' + (statusBarContactDetail ? ' screenContactBg' : !statusBarTranslucent ? ' screenBlack' : '')} style={{ background: `url('${wallpaper || bg}')` }}>
          <div className={`notificationBar`}>
            <div className='notificationItem center'>
              <span>{time}</span>
            </div>
            <div className='notch'>
              <div className={(page == 'lock' ? '' : 'hidden')}>
                <LockIcon />
              </div>
              <img src={camera} alt="Cam" className='camera' />
            </div>
            <div className='notificationItem right'>
              {flightMode ?
                <AirPlaneIcon />
                :
                <>
                  <SignalIcon />
                </>
              }
              <i className="fa-solid fa-battery-full" style={{ marginLeft: '5px' }}></i>
            </div>
          </div>

          {page == 'lock' &&
            <div ref={activePageRef} className={'lockScreen show'}>
              <div className='lockScreenTop flexgrow'>
                <span className='lockScreenDateText'>{date}</span>
                <span className='lockScreenClockText'>{time}</span>
              </div>
              <div className='lockScreenBottom flexgrow'>
                <div className='lockScreenUnlockButton' onClick={handleUnlock}>
                  <span className='lockScreenUnlockText'>Clique para desbloquear</span>
                  <div className='unlockBar' />
                </div>
              </div>
            </div>
          }

          {page == 'passcode' &&
            <div ref={activePageRef} className='passcodeScreen show'>
              <div className='passcodeScreenMainContainer'>
                <span className='passcodeScreenMainText'>Informe sua senha</span>
                <div ref={passcodeIndicatorRef} className='passcodeScreenPassContainer'>
                  <div className={'passcodeScreenPassItem' + (passcode.length >= 1 ? ' active' : '')} />
                  <div className={'passcodeScreenPassItem' + (passcode.length >= 2 ? ' active' : '')} />
                  <div className={'passcodeScreenPassItem' + (passcode.length >= 3 ? ' active' : '')} />
                  <div className={'passcodeScreenPassItem' + (passcode.length >= 4 ? ' active' : '')} />
                </div>
                <div className='passcodeScreenNumbersContainer'>
                  <div className='passcodeScreenNumbersRow'>
                    <div className='passcodeScreenNumber' onClick={() => handleUpdatePasscode('1')}>
                      <span>1</span>
                    </div>
                    <div className='passcodeScreenNumber' onClick={() => handleUpdatePasscode('2')}>
                      <span>2</span>
                    </div>
                    <div className='passcodeScreenNumber' onClick={() => handleUpdatePasscode('3')}>
                      <span>3</span>
                    </div>
                  </div>
                  <div className='passcodeScreenNumbersRow'>
                    <div className='passcodeScreenNumber' onClick={() => handleUpdatePasscode('4')}>
                      <span>4</span>
                    </div>
                    <div className='passcodeScreenNumber' onClick={() => handleUpdatePasscode('5')}>
                      <span>5</span>
                    </div>
                    <div className='passcodeScreenNumber' onClick={() => handleUpdatePasscode('6')}>
                      <span>6</span>
                    </div>
                  </div>
                  <div className='passcodeScreenNumbersRow'>
                    <div className='passcodeScreenNumber' onClick={() => handleUpdatePasscode('7')}>
                      <span>7</span>
                    </div>
                    <div className='passcodeScreenNumber' onClick={() => handleUpdatePasscode('8')}>
                      <span>8</span>
                    </div>
                    <div className='passcodeScreenNumber' onClick={() => handleUpdatePasscode('9')}>
                      <span>9</span>
                    </div>
                  </div>
                  <div className='passcodeScreenNumbersRow'>
                    <div className='passcodeScreenNumber outlined' onClick={handleBackspacePasscode}>
                      <BackSpaceIcon />
                    </div>
                    <div className='passcodeScreenNumber' onClick={() => handleUpdatePasscode('0')}>
                      <span>0</span>
                    </div>
                    <div className='passcodeScreenNumber transparent'>
                      <span>-</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }

          {page == 'home' &&
            <div ref={activePageRef} className='homeScreen show'>
              <div className='homeScreenMenu'>

              </div>
              <div className='homeScreenBottom'>
                <div></div>
                <div className='homeScreenBottomMenu'>
                  <div className='homeScreenMenuItem'>
                    <img src={phoneIcon} alt="phone" onClick={handleOpenPhone} />
                  </div>
                  <div className='homeScreenMenuItem'>
                    <img src={settingsIcon} alt="Settings" onClick={handleOpenSettings} />
                  </div>
                  <div className='homeScreenMenuItem'>
                    <img src={messagesIcon} alt="messages" onClick={handleOpenMessages} />
                  </div>
                </div>
              </div>
            </div>
          }

          {page == 'settings' &&
            <div ref={activePageRef} className='settingsScreen show'>
              <div>
                <span className='settingsScreenTitle'>Configurações</span>

                <div className='settingsScreenMenuSection'>
                  <div className='settingsScreenMenuItem'>
                    <div className='settingsScreenMenuItemStart'>
                      <div className='settingsScreenMenuItemIcon settingsScreenMenuItemFlightModeIcon' >
                        <AirPlaneIcon />
                      </div>
                      <span>Modo avião</span>
                    </div>
                    <div>

                      <div className={'settingsScreenMenuItemCheckbox' + (flightMode ? ' active' : ' inactive')} onClick={handleToggleFlightMode}>
                        <div className='settingsScreenMenuItemCheckboxToggle' />
                      </div>

                    </div>
                  </div>
                  <hr />
                  <div className='settingsScreenMenuItem'>
                    <div className='settingsScreenMenuItemStart'>
                      <div className='settingsScreenMenuItemIcon settingsScreenMenuItemPhoneIcon' >
                        <PhoneIcon />
                      </div>
                      <span>Celular: {cellphone}</span>
                    </div>
                  </div>
                </div>

                <div className='settingsScreenMenuSection'>
                  <div className='settingsScreenMenuItem' onClick={handleSubMenuSounds}>
                    <div className='settingsScreenMenuItemStart'>
                      <div className='settingsScreenMenuItemIcon settingsScreenMenuSoundsIcon' >
                        <SoundsIcon />
                      </div>
                      <span>Sons</span>
                    </div>
                  </div>
                </div>

                <div className='settingsScreenMenuSection'>
                  <div className='settingsScreenMenuItem' onClick={() => changePage('settings:wallpaper')}>
                    <div className='settingsScreenMenuItemStart'>
                      <div className='settingsScreenMenuItemIcon settingsScreenMenuWallpaperIcon' >
                        <WallpaperIcon />
                      </div>
                      <span>Wallpaper</span>
                    </div>
                  </div>
                  <hr />
                  <div className='settingsScreenMenuItem' onClick={() => changePage('settings:scale')}>
                    <div className='settingsScreenMenuItemStart'>
                      <div className='settingsScreenMenuItemIcon settingsScreenMenuScaleIcon' >
                        <ZoomInOutlined />
                      </div>
                      <span>Escala</span>
                    </div>
                  </div>
                  <hr />
                  <div className='settingsScreenMenuItem' onClick={handleSubMenuPassword}>
                    <div className='settingsScreenMenuItemStart'>
                      <div className='settingsScreenMenuItemIcon settingsScreenMenuPasscodeIcon' >
                        <PasscodeIcon />
                      </div>
                      <span>Senha</span>
                    </div>
                  </div>
                </div>
              </div>
              <div></div>
            </div>
          }

          {page == 'settings:sounds' &&
            <div ref={activePageRef} className='settingsScreenSounds show'>
              <div className='settingsScreenSoundsTop'>
                <div className='settingsScreenSoundsTopBackButton' onClick={handlebackToSettings}>
                  <LeftOutlined />
                  <span>
                    Voltar
                  </span>
                </div>
                <div className='settingsScreenSoundsTopTitle'>
                  <span>Sons</span>
                </div>
                <div />
              </div>
              <div className='settingsScreenSoundsBody'>
                <div className='settingsScreenSoundsSection'>
                  <span className='settingsScreenSoundsSectionTitle'>
                    Volume
                  </span>
                  <div className='settingsScreenSoundsSectionData'>
                    <VolumeMinIcon />
                    <input type="range" min={0} max={100} value={ringtoneVolume} onChange={(ev) => setRingtoneVolume(Number(ev.currentTarget.value))} />
                    <VolumeMaxIcon />
                  </div>
                </div>
              </div>
            </div>
          }

          {page == 'settings:wallpaper' &&
            <div ref={activePageRef} className='settingsScreenWallpaper show'>
              <div className='settingsScreenWallpaperTop'>
                <div className='settingsScreenWallpaperTopBackButton' onClick={handlebackToSettings}>
                  <LeftOutlined />
                  <span>
                    Voltar
                  </span>
                </div>
                <div className='settingsScreenWallpaperTopTitle'>
                  <span>Wallpaper</span>
                </div>
                <div />
              </div>
              <div className='settingsScreenWallpaperBody'>
                <div className='settingsScreenWallpaperSection'>
                  <div className='settingsScreenWallpaperImageContainer' >
                    <span>Imagem atual</span>
                    <img src={wallpaper || bg} alt="Background" />
                  </div>

                  <div className='settingsScreenWallpaperSetImage' >
                    <input type="text" placeholder='Url' ref={inputWallpaperRef} defaultValue={wallpaper} />
                    <div className={'settingsScreenWallpaperSetImageButton'} onClick={handleChangeWallpaper} >
                      <CheckOutlined />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }

          {page == 'settings:password' &&
            <div ref={activePageRef} className='settingsScreenpassword show'>
              <div className='settingsScreenpasswordTop'>
                <div className='settingsScreenpasswordTopBackButton' onClick={handlebackToSettings}>
                  <LeftOutlined />
                  <span>
                    Voltar
                  </span>
                </div>
                <div className='settingsScreenpasswordTopTitle'>
                  <span>Senha</span>
                </div>
                <div />
              </div>
              <div className='settingsScreenpasswordBody'>
                <div className='settingsScreenpasswordSection'>
                  {hasPassword() ?
                    <>
                      <div className='settingsScreenpasswordSectionItem' onClick={() => setPassword('')}>
                        <span>
                          Desabilitar Senha
                        </span>
                      </div>
                      <hr />
                      <div className='settingsScreenpasswordSectionItem' onClick={handleOpenNewPassword}>
                        <span>
                          Atualizar Senha
                        </span>
                      </div>
                    </>
                    :
                    <>
                      <div className='settingsScreenpasswordSectionItem' onClick={handleOpenNewPassword}>
                        <span>
                          Criar Senha
                        </span>
                      </div>
                    </>
                  }
                </div>
              </div>
            </div>
          }

          {page == 'settings:password:newPassword' &&
            <div ref={activePageRef} className='settingsScreenpasswordNew show'>
              <div className='settingsScreenpasswordNewTop'>
                <div className='settingsScreenpasswordNewTopBackButton' onClick={handlebackToSettings}>
                  <LeftOutlined />
                  <span>
                    Voltar
                  </span>
                </div>
                <div className='settingsScreenpasswordNewTopTitle'>
                  <span>Criar Senha</span>
                </div>
                <div />
              </div>
              <div className='settingsScreenpasswordNewBody'>
                <div className='settingsScreenpasswordNewPasswordContainer'>
                  <div className='settingsScreenpasswordNewPasswordIndicator'>
                    <div className={newPassword.length >= 1 ? 'active' : ''} />
                    <div className={newPassword.length >= 2 ? 'active' : ''} />
                    <div className={newPassword.length >= 3 ? 'active' : ''} />
                    <div className={newPassword.length >= 4 ? 'active' : ''} />
                  </div>

                  <div className='settingsScreenpasswordNewPasswordKeyboardContainer'>
                    <div className='settingsScreenpasswordNewPasswordKeyboardRow'>
                      <div
                        className='settingsScreenpasswordNewPasswordKeyboardNumber'
                        onClick={() => handleAddDigitToNewPassword('1')}
                      >
                        <span>
                          1
                        </span>
                      </div>
                      <div
                        className='settingsScreenpasswordNewPasswordKeyboardNumber'
                        onClick={() => handleAddDigitToNewPassword('2')}
                      >
                        <span>
                          2
                        </span>
                      </div>
                      <div
                        className='settingsScreenpasswordNewPasswordKeyboardNumber'
                        onClick={() => handleAddDigitToNewPassword('3')}
                      >
                        <span>
                          3
                        </span>
                      </div>
                    </div>
                    <div className='settingsScreenpasswordNewPasswordKeyboardRow'>
                      <div
                        className='settingsScreenpasswordNewPasswordKeyboardNumber'
                        onClick={() => handleAddDigitToNewPassword('4')}
                      >
                        <span>
                          4
                        </span>
                      </div>
                      <div
                        className='settingsScreenpasswordNewPasswordKeyboardNumber'
                        onClick={() => handleAddDigitToNewPassword('5')}
                      >
                        <span>
                          5
                        </span>
                      </div>
                      <div
                        className='settingsScreenpasswordNewPasswordKeyboardNumber'
                        onClick={() => handleAddDigitToNewPassword('6')}
                      >
                        <span>
                          6
                        </span>
                      </div>
                    </div>
                    <div className='settingsScreenpasswordNewPasswordKeyboardRow'>
                      <div
                        className='settingsScreenpasswordNewPasswordKeyboardNumber'
                        onClick={() => handleAddDigitToNewPassword('7')}
                      >
                        <span>
                          7
                        </span>
                      </div>
                      <div
                        className='settingsScreenpasswordNewPasswordKeyboardNumber'
                        onClick={() => handleAddDigitToNewPassword('8')}
                      >
                        <span>
                          8
                        </span>
                      </div>
                      <div
                        className='settingsScreenpasswordNewPasswordKeyboardNumber'
                        onClick={() => handleAddDigitToNewPassword('9')}
                      >
                        <span>
                          9
                        </span>
                      </div>
                    </div>
                    <div className='settingsScreenpasswordNewPasswordKeyboardRow'>
                      <div className='settingsScreenpasswordNewPasswordKeyboardNumber transparent'>
                      </div>
                      <div
                        className='settingsScreenpasswordNewPasswordKeyboardNumber'
                        onClick={() => handleAddDigitToNewPassword('0')}
                      >
                        <span>
                          0
                        </span>
                      </div>
                      <div className='settingsScreenpasswordNewPasswordKeyboardNumber'>
                        <div className='passcodeScreenNumber' onClick={handleBackspaceNewPassword}>
                          <BackSpaceIcon />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }

          {page == 'messages' &&
            <div ref={activePageRef} className='messagesScreen show'>
              <div className='messagesScreenHeader'>
                <span className='messagesScreenTitle'>Mensagens</span>
                <div className='messagesScreenHeaderNewChat' onClick={() => handleOpenNewMessageOptions()}>
                  <NewChatIcon />
                </div>
              </div>
              <div className='messagesScreenBody'>
                <div className='messagesScreenSearchInput'>
                  <SearchIcon />
                  <input type="text" className='' placeholder='Pesquisa' value={searchLastMessage} onChange={(ev) => setSearchLastMessage(ev.currentTarget.value)} />
                </div>

                <div className='messagesScreenList'>
                  {searchedLastMessages.map((message, i) => {
                    return (
                      <div key={i} className='messagesScreenMessageItem' onClick={() => handleOpenChat(message.phoneGroupId ? message.phoneGroupId : message.number.toString())}>
                        <div>
                          <div className='messagesScreenMessageItemIcon'>
                            {message.phoneGroupId ?
                              <GroupIcon />
                              :
                              <PersonIcon />
                            }
                          </div>
                        </div>
                        <div className='messagesScreenMessageItemData'>
                          <div className='messagesScreenMessageItemDataTitle'>
                            <span className='messagesScreenMessageItemTitle'>{message.title}</span>
                            {!message.read &&
                              <div className='messagesScreenMessageItemUnread' />
                            }
                          </div>
                          <div className='messagesScreenMessageItemInfo'>
                            <span>{formatTime(message.registerDate)}</span>
                            <span>{message.message}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          }

          {page == 'messages:new:options' &&
            <div ref={activePageRef} className='newmessageOptionsScreen show'>
              <div className='newmessageOptionsScreenHeader'>
                <div className='newmessageOptionsScreenBackButton' onClick={() => changePage('messages')}>
                  <LeftOutlined />
                </div>
                <span>Nova Mensagem</span>
              </div>
              <div className='newMessageOptionsScreenBody'>
                <div className='newmessageOptionsScreenSearch'>
                  <div className='newmessageOptionsScreenSearchInput'>
                    <input value={newMessageSearch} type="text" placeholder='Pesquisar Contato' onChange={(ev) => setNewMessageSearch(ev.currentTarget.value)} />
                  </div>
                </div>
                <div className='newMessageOptionsScreenSection'>
                  <div className='newMessageOptionsScreenSectionOption' onClick={() => changePage('messages:new')}>
                    <GroupIcon />
                    <span>Novo Grupo</span>
                  </div>
                  <hr />
                  <div className='newMessageOptionsScreenSectionOption' onClick={() => handleOpenNewContact({ name: '', number: null, favorite: false, blocked: false })}>
                    <PersonIcon />
                    <span>Novo Contato</span>
                  </div>
                </div>
                <div className='newMessageOptionsScreenContactList'>
                  {newMessageOptionsContactsResult.map((item, i) => {
                    return (
                      <div key={i} className='newMessageOptionsScreenContactListItem' onClick={() => handleOpenChat(item.number.toString())}>
                        <div className='newMessageOptionsScreenContactListItemImage'>
                          <PersonIcon />
                        </div>
                        <div>
                          <span>{item.name}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          }

          {page == 'messages:new' &&
            <div ref={activePageRef} className='newmessageScreen show'>
              <div className='newmessageScreenHeader'>
                <div className='newmessageScreenBackButton' onClick={handleOpenNewMessageOptions}>
                  <LeftOutlined />
                </div>
                <span>Novo Grupo</span>
              </div>
              <div className='newmessageScreenBody'>
                <div>
                  <div className='newmessageScreenSelectedContacts'>
                    {newMessageSelectedContacts.map((item, i) => {
                      return (
                        <div className='newmessageScreenSelectedContactItem' onClick={() => handleRemoveContactToMessage(item.number)}>
                          <span>{item.name}</span>
                          <div>
                            <CloseOutlined />
                          </div>
                        </div>
                      )
                    })
                    }
                  </div>
                  <div className='newmessageScreenSearch'>
                    <div className='newmessageScreenSearchInput'>
                      <input ref={newMessageContactInputRef} type="text" placeholder='Pesquisar Contato' onChange={(ev) => searchMessageContacts(ev.currentTarget.value)} />
                      <div onClick={() => handleClearMessageContactInput()} className='' hidden={(newMessageContactInputRef?.current?.value?.length ?? 0) < 1}>
                        <CloseOutlined color='white' />
                      </div>
                    </div>
                    <div className='newmessageScreenSearchResult show' hidden={newMessageContactsResult.length < 1}>
                      {newMessageContactsResult.map((item, i) => {
                        return (
                          <div key={i} className='newmessageScreenSearchResultItem' onClick={() => handleAddContactToMessage(item.number)}>
                            <div className='newmessageScreenSearchResultItemImage'>
                              <PersonIcon />
                            </div>
                            <div>
                              <span>{item.name}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div className='newmessageScreenGroupName'>
                    <div className='newmessageScreenGroupNameInput'>
                      <input type="text" placeholder='Nome do Grupo' onChange={(ev) => setNewMessageGroupName(ev.currentTarget.value)} maxLength={25} />
                    </div>
                  </div>
                </div>
                <div className='newMessageBottom'>
                  <div className='newMessageSendButton' onClick={() => handleCreateNewGroup()}>
                    Criar Grupo
                  </div>
                </div>
              </div>
            </div>
          }
          {page == 'messages:chat' &&
            <div ref={activePageRef} className='messageChatScreen show'>
              <div className='messageChatScreenHeader'>
                <div className='messageChatScreenBackButton' onClick={() => changePage('messages')}>
                  <LeftOutlined />
                </div>
                <div className='messageChatScreenIcon'>
                  {chat.isGroup ?
                    <GroupIcon />
                    :
                    <PersonIcon />
                  }
                </div>
                <div className='messageChatScreenIntegrants' onClick={() => handleOpenGroupDetail()}>
                  <span className='messageChatScreenIntegrant'>
                    {chat.isGroup ? groups.find(x => x.id == chat.identifier)?.name : getContactName(Number(chat.identifier))}
                  </span>
                </div>
              </div>
              <div className='messageChatScreenMessages'>
                {currentChatMessages.map((item, i) => {
                  if (chat.isGroup)
                    return (
                      <div key={i} className={'messageChatScreenMessage' + (item.from == 'me' ? ' me' : '')}>
                        <div hidden={item.from == 'me'} className='messageChatScreenMessageIcon'>
                          <PersonIcon />
                        </div>
                        <div className={'messageChatScreenMessageInfo' + (item.from == 'me' ? ' me' : '')}>
                          <span hidden={item.from == 'me'} style={{ fontWeight: 'bold' }}>{item.from}</span>
                          {item.type === PhoneMessageType.Location ?
                            <span onClick={() => trackLocation(item.locationX, item.locationY)}><EnvironmentOutlined /> Localização</span>
                            :
                            <span>{item.text}</span>}
                          <span style={{ fontWeight: 'lighter', textAlign: 'right' }}>{formatDateTime(item.date)}</span>
                        </div>
                      </div>
                    )

                  return (
                    <div key={i} className={'messageChatScreenMessage' + (item.from == 'me' ? ' me' : '')}>
                      <div className={'messageChatScreenMessageInfo' + (item.from == 'me' ? ' me' : '')}>
                        {item.type === PhoneMessageType.Location ?
                          <span onClick={() => trackLocation(item.locationX, item.locationY)}><EnvironmentOutlined /> Localização</span>
                          :
                          <span>{item.text}</span>
                        }
                        <span style={{ fontWeight: 'lighter', textAlign: 'right' }}>{formatDateTime(item.date)}</span>
                      </div>
                    </div>
                  )
                })
                }
              </div>
              <div className='messageChatScreenSendMessage'>
                <div className='messageChatScreenSendLocationButton' onClick={() => sendLocation(chat.identifier)}>
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <input maxLength={255} value={messageText}
                  onChange={(ev) => setMessageText(ev.currentTarget.value)} type="text"
                  placeholder='Digite sua mensagem' onKeyDown={handleTextKeyDown} />
                <div className='messageChatScreenSendMessageButton' onClick={handleSendMessage}>
                  <SendOutlined />
                </div>
              </div>
            </div>
          }
          {
            page == 'messages:chat:detail' &&
            <div ref={activePageRef} className='messageChatDetailScreen show'>
              <div className='messageChatDetailScreenHeader'>
                <div className='messageChatDetailScreenBackButton' onClick={handleBackToChat}>
                  <LeftOutlined />
                </div>
                <div className='messageChatDetailScreenPageTitle'>
                  <span>Dados do Grupo</span>
                </div>
              </div>
              <div className='messageChatDetailScreenBody'>
                <div className='messageChatDetailScreenGroupDetail'>
                  <div className='messageChatDetailScreenGroupDetailPicture'>
                    <GroupIcon />
                  </div>
                  <div className='messageChatDetailScreenGroupDetailName'>
                    <span>{groups.find(x => x.id == chat.identifier)?.name}</span>
                    <span style={{ color: 'gray' }}>{chat.participants.length} membro(s)</span>
                  </div>
                </div>
                <div className='messageChatDetailScreenOptions'>
                  <div className='messageChatDetailScreenOption danger' onClick={handleExitMessageGroup}>
                    <span>Sair do Grupo</span>
                  </div>
                </div>
                {chat.isAdmin && <div className='messageChatDetailScreenOptions'>
                  <div className='messageChatDetailScreenOption' onClick={() => changePage('messages:chat:addMembers')}>
                    <span>Adicionar Membro</span>
                  </div>
                </div>}
                <div className='messageChatDetailScreenParticipantList'>
                  {chat.participants.map((participant, i) => {
                    return (
                      <div className='messageChatDetailScreenParticipant'>
                        <div>
                          <div className='messageChatDetailScreenParticipantPicture'>
                            <PersonIcon />
                          </div>
                        </div>
                        <div className='messageChatDetailScreenParticipantName'>
                          <span>{participant.name}</span>
                        </div>
                        {chat.isAdmin && <div className='messageChatDetailScreenParticipantOptions'>
                          <div className='messageChatDetailScreenParticipantOption' onClick={() => handleToggleUserGroupPermission(participant.number)}>
                            {participant.permission === PhoneGroupUserPermission.User ? <StarOutlined /> : <StarFilled />}
                          </div>
                          <div className='messageChatDetailScreenParticipantOption danger' onClick={() => handleRemoveUserGroup(participant.number)}>
                            <DeleteOutlined />
                          </div>
                        </div>}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          }
          {page == 'messages:chat:addMembers' &&
            <div ref={activePageRef} className='newmessageScreen show'>
              <div className='newmessageScreenHeader'>
                <div className='newmessageScreenBackButton' onClick={() => changePage('messages:chat:detail')}>
                  <LeftOutlined />
                </div>
                <span>Adicionar Membros</span>
              </div>
              <div className='newmessageScreenBody'>
                <div>
                  <div className='newmessageScreenSelectedContacts'>
                    {newMessageSelectedContacts.map((item, i) => {
                      return (
                        <div className='newmessageScreenSelectedContactItem' onClick={() => handleRemoveContactToMessage(item.number)}>
                          <span>{item.name}</span>
                          <div>
                            <CloseOutlined />
                          </div>
                        </div>
                      )
                    })
                    }
                  </div>
                  <div className='newmessageScreenSearch'>
                    <div className='newmessageScreenSearchInput'>
                      <input ref={newMessageContactInputRef} type="text" placeholder='Pesquisar Contato' onChange={(ev) => searchMessageContacts(ev.currentTarget.value)} />
                      <div onClick={() => handleClearMessageContactInput()} className='' hidden={(newMessageContactInputRef?.current?.value?.length ?? 0) < 1}>
                        <CloseOutlined color='white' />
                      </div>
                    </div>
                    <div className='newmessageScreenSearchResult show' hidden={newMessageContactsResult.length < 1}>
                      {newMessageContactsResult.map((item, i) => {
                        return (
                          <div key={i} className='newmessageScreenSearchResultItem' onClick={() => handleAddContactToMessage(item.number)}>
                            <div className='newmessageScreenSearchResultItemImage'>
                              <PersonIcon />
                            </div>
                            <div>
                              <span>{item.name}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
                <div className='newMessageBottom'>
                  <div className='newMessageSendButton' onClick={handleAddMembers}>
                    Adicionar Membros
                  </div>
                </div>
              </div>
            </div>
          }
          {
            page === 'settings:scale' &&
            <div ref={activePageRef} className='settingsScreenSounds show'>
              <div className='settingsScreenSoundsTop'>
                <div className='settingsScreenSoundsTopBackButton' onClick={handlebackToSettings}>
                  <LeftOutlined />
                  <span>
                    Voltar
                  </span>
                </div>
                <div className='settingsScreenSoundsTopTitle'>
                  <span>Escala</span>
                </div>
                <div />
              </div>
              <div className='settingsScreenSoundsBody'>
                <div className='settingsScreenSoundsSection'>
                  <span className='settingsScreenSoundsSectionTitle'>
                    Escala
                  </span>
                  <div className='settingsScreenSoundsSectionData'>
                    <ZoomOutOutlined />
                    <input type="range" min={20} max={70} value={scale} onChange={(ev) => setScale(Number(ev.currentTarget.value))} />
                    <ZoomInOutlined />
                  </div>
                </div>
              </div>
            </div>
          }

          {
            isPhonePage &&
            <div ref={activePageRef} className='phoneScreen show'>
              {page == 'phone' &&
                <>
                  <div className='phoneScreenHeader'>
                    <span>Recentes</span>
                  </div>
                  <div className='phoneScreenBody calls'>
                    <hr />
                    {phoneHistory.map((item, i) => {
                      const number = item.origin === cellphone ? item.number : item.origin
                      return (
                        <Fragment key={i}>
                          <div className='phoneScreenCall'>
                            <div className='phoneScreenCallInfo'>
                              {item.origin !== cellphone &&
                                <PhoneReceivedIcon />
                              }
                              {item.origin === cellphone &&
                                <PhoneMadeIcon />
                              }
                              <span className={item.type === PhoneCallType.Lost ? 'lostCall' : ''}>{getContactName(number)}</span>
                            </div>
                            <div className='phoneScreenCallInfo end'>
                              <span>{formatTime(item.registerDate)}</span>
                              <div className='phoneScreenCallInfoButton' onClick={() => openContactByNumber(number)}>
                                <InfoIcon />
                              </div>
                            </div>
                          </div>
                          <hr />
                        </Fragment>
                      )
                    })
                    }
                  </div>
                </>
              }
              {page == 'phone:contacts' &&
                <>
                  <div className='phoneScreenHeader'>
                    <span>Contatos</span>
                    <div className='phoneScreenHeaderAddButton' onClick={() => handleOpenNewContact({ name: '', number: 0, favorite: false, blocked: false })}>
                      <PlusOutlined />
                    </div>
                  </div>
                  <div className='phoneScreenBody contacts'>
                    <div className='phoneScreenContactsSearchInput'>
                      <SearchIcon />
                      <input type="text" placeholder='Pesquisar' value={searchContact} onChange={(ev) => setSearchContact(ev.currentTarget.value)} />
                    </div>
                    <hr />
                    {searchedPhoneContactList.map((item, i) => {
                      return (
                        <Fragment key={i}>
                          <div className='phoneScreenContact' onClick={() => handleOpenContactDetail(item)}>
                            <div className='phoneScreenContactInfo'>
                              <span>{item.name}</span>
                            </div>
                          </div>
                          <hr />
                        </Fragment>
                      )
                    })
                    }
                  </div>
                </>
              }
              {page == 'phone:favorite' &&
                <>
                  <div className='phoneScreenHeader'>
                    <span>Favoritos</span>
                  </div>
                  <div className='phoneScreenBody contacts'>
                    {phoneContactList.filter(x => x.favorite).map((item, i) => {
                      return (
                        <Fragment key={i}>
                          <div className='phoneScreenContact' onClick={() => handleOpenContactDetail(item)}>
                            <div className='phoneScreenContactInfo'>
                              <span>{item.name}</span>
                            </div>
                          </div>
                          <hr />
                        </Fragment>
                      )
                    })
                    }
                  </div>
                </>
              }
              {page == 'phone:keypad' &&
                <>
                  <div className='phoneScreenBody keypad'>
                    <div className='phoneScreenKeypadDisplay'>
                      <span>{keypadNumber}</span>
                    </div>
                    <div className='phoneScreenKeypadNumbersContainer'>
                      <div className='phoneScreenKeypadNumbersRow'>
                        <div className='phoneScreenKeypadNumber' onClick={() => handleAddKeypadNumber('1')}>
                          <span>1</span>
                        </div>
                        <div className='phoneScreenKeypadNumber' onClick={() => handleAddKeypadNumber('2')}>
                          <span>2</span>
                        </div>
                        <div className='phoneScreenKeypadNumber' onClick={() => handleAddKeypadNumber('3')}>
                          <span>3</span>
                        </div>
                      </div>
                      <div className='phoneScreenKeypadNumbersRow'>
                        <div className='phoneScreenKeypadNumber' onClick={() => handleAddKeypadNumber('4')}>
                          <span>4</span>
                        </div>
                        <div className='phoneScreenKeypadNumber' onClick={() => handleAddKeypadNumber('5')}>
                          <span>5</span>
                        </div>
                        <div className='phoneScreenKeypadNumber' onClick={() => handleAddKeypadNumber('6')}>
                          <span>6</span>
                        </div>
                      </div>
                      <div className='phoneScreenKeypadNumbersRow'>
                        <div className='phoneScreenKeypadNumber' onClick={() => handleAddKeypadNumber('7')}>
                          <span>7</span>
                        </div>
                        <div className='phoneScreenKeypadNumber' onClick={() => handleAddKeypadNumber('8')}>
                          <span>8</span>
                        </div>
                        <div className='phoneScreenKeypadNumber' onClick={() => handleAddKeypadNumber('9')}>
                          <span>9</span>
                        </div>
                      </div>
                      <div className='phoneScreenKeypadNumbersRow'>
                        <div className='phoneScreenKeypadNumber outlined' onClick={handleRemoveKeypadNumber}>
                          <BackSpaceIcon />
                        </div>
                        <div className='phoneScreenKeypadNumber' onClick={() => handleAddKeypadNumber('0')}>
                          <span>0</span>
                        </div>
                        <div className='phoneScreenKeypadNumber transparent'>
                          <span>-</span>
                        </div>
                      </div>
                      <div className='phoneScreenKeypadNumbersRow'>
                        <div className='phoneScreenKeypadNumber transparent'>
                          <span>-</span>
                        </div>
                        <div className='phoneScreenKeypadNumber call' onClick={() => callNumber(Number(keypadNumber))}>
                          <PhoneIcon />
                        </div>
                        <div className='phoneScreenKeypadNumber transparent'>
                          <span>-</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              }

              <div className='phoneScreenMenuBottom'>
                <div className={'phoneScreenMenuBottomItem ' + (page == 'phone:favorite' ? 'selected' : '')} onClick={handleOpenPhoneFavorite}>
                  <FavoriteIcon />
                  <span>Favoritos</span>
                </div>
                <div className={'phoneScreenMenuBottomItem ' + (page == 'phone' ? 'selected' : '')} onClick={handleOpenPhoneRecents}>
                  <RecentsIcon />
                  <span>Recentes</span>
                </div>
                <div className={'phoneScreenMenuBottomItem ' + (page == 'phone:contacts' ? 'selected' : '')} onClick={handleOpenPhoneContacts}>
                  <ContactsIcon />
                  <span>Contatos</span>
                </div>
                <div className={'phoneScreenMenuBottomItem ' + (page == 'phone:keypad' ? 'selected' : '')} onClick={handleOpenPhoneKeypad}>
                  <KeyPadIcon />
                  <span>Teclado</span>
                </div>
              </div>
            </div>
          }

          {
            page == 'phone:contacts:newContact' &&
            <div ref={activePageRef} className='phoneScreenNewContact show'>
              <div className='phoneScreenNewContactBody'>
                <div className='phoneScreenNewContactPersonIcon'>
                  <PersonIcon />
                </div>
                <div className='phoneScreenNewContactInput'>
                  <PersonIcon />
                  <input maxLength={25} type="text" placeholder='Nome' value={newContactNameInput} onChange={(ev) => setNewContactNameInput(ev.currentTarget.value)} />
                </div>
                <div className='phoneScreenNewContactInput'>
                  <PhoneIcon />
                  <input type="number" placeholder='Número' value={newContactNumberInput} onChange={(ev) => setNewContactNumberInput(Number(ev.currentTarget.value))} />
                </div>
              </div>
              <div className='phoneScreenNewContactBottom'>
                <span onClick={handleBackToPhoneContacts}>
                  Cancelar
                </span>
                <span onClick={handleSaveContact}>
                  Salvar
                </span>
              </div>
            </div>
          }

          {
            page == 'phone:contacts:contact' &&
            <div ref={activePageRef} className='phoneScreenContactDetail show'>
              <div className='phoneScreenContactDetailHeader'>
                <div className='phoneScreenContactDetailHeaderTop'>
                  <div className='phoneScreenContactDetailHeaderTopBackButton' onClick={handleBackToPhoneContacts}>
                    <LeftOutlined />
                  </div>
                  <div className='phoneScreenContactDetailHeaderTopEditButton' onClick={() => handleEditContact()}>
                    <span>Editar</span>
                  </div>
                </div>
                <div className='phoneScreenContactDetailData'>
                  <div className='phoneScreenContactDetailDataPersonIcon'>
                    <PersonIcon />
                  </div>
                  <div className='phoneScreenContactDetailDataName'>
                    {currentContact.name}
                  </div>
                </div>
                <div className='phoneScreenContactDetailHeaderButtons'>
                  <div className='phoneScreenContactDetailHeaderButton' onClick={() => handleOpenChat(currentContact.number.toString())}>
                    <MessageIcon />
                  </div>
                  <div className='phoneScreenContactDetailHeaderButton' onClick={() => callNumber(currentContact.number)}>
                    <PhoneIcon />
                  </div>
                  <div className='phoneScreenContactDetailHeaderButton' onClick={() => sendLocation(currentContact.number.toString())}>
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                </div>
              </div>
              <div className='phoneScreenContactDetailOptions'>
                <div className='phoneScreenContactDetailOptionsSection'>
                  <div className='phoneScreenContactDetailOptionsSectionItem'>
                    <span className='phoneScreenContactDetailOptionsSectionTitle'>
                      Número
                    </span>
                    <span className='phoneScreenContactDetailOptionsSectionButtonText'>
                      {currentContact.number}
                    </span>
                  </div>
                </div>
                <div className='phoneScreenContactDetailOptionsSection'>
                  <div className='phoneScreenContactDetailOptionsSectionItem'>
                    {!currentContact.favorite && <span className='phoneScreenContactDetailOptionsSectionButtonText' onClick={() => toggleCurrentContactFavorite(true)}>
                      Adicionar aos Favoritos
                    </span>}
                    {currentContact.favorite && <span className='phoneScreenContactDetailOptionsSectionButtonTextDanger' onClick={() => toggleCurrentContactFavorite(false)}>
                      Remover dos Favoritos
                    </span>}
                  </div>
                </div>
                <div className='phoneScreenContactDetailOptionsSection'>
                  <div className='phoneScreenContactDetailOptionsSectionItem'>
                    {!currentContact.blocked && <span className=' phoneScreenContactDetailOptionsSectionButtonTextDanger' onClick={() => toggleCurrentContactBlocked(true)}>
                      Bloquear Contato
                    </span>}
                    {currentContact.blocked && <span className='phoneScreenContactDetailOptionsSectionButtonText' onClick={() => toggleCurrentContactBlocked(false)}>
                      Desbloquear Contato
                    </span>}
                  </div>
                  <hr />
                  <div className='phoneScreenContactDetailOptionsSectionItem' onClick={deleteContact}>
                    <span className='phoneScreenContactDetailOptionsSectionButtonTextDanger'>
                      Apagar Contato
                    </span>
                  </div>
                </div>
              </div>
            </div>
          }

          {
            page == 'phone:keypad:call' &&
            <div ref={activePageRef} className='phoneScreenKeypadCall show'>
              <div className='phoneScreenKeypadCallTopContainer'>
                <span>
                  {callTime == 0 ? 'Chamando...' : formatCallTime(callTime)}
                </span>
                <span>
                  {callContact}
                </span>
              </div>
              <div className='phoneScreenKeypadCallBottomContainer'>
                <div className='phoneScreenKeypadCallBottomEndCall' onClick={handleEndCall}>
                  <PhoneEndCallIcon />
                </div>
              </div>
            </div>
          }

          {
            page == 'call' &&
            < div ref={activePageRef} className='callScreen show'>
              <div className='callScreenTopContainer'>
                <span>
                  {callContact}
                </span>
              </div>
              <div className='callScreenBottomContainer'>
                <div className='callScreenBottomButton accept' onClick={handleAcceptCall}>
                  <PhoneIcon />
                </div>
                <div className='callScreenBottomButton end' onClick={handleEndCall}>
                  <PhoneEndCallIcon />
                </div>
              </div>
            </div>
          }

          <div className='bottomBar' hidden={statusBarTranslucent}>
            <div className="mainbar" onClick={handleBackHome} />
          </div>
        </div>
        <img src={iphoneShape} alt="Phone" className='shape' />
      </div>
    </div>
  )
}