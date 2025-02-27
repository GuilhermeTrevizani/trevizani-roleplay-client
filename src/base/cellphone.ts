import { webView, setPages, toggleView, configureEvent } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

let cellphone = 0;
let temperature = '';
let weather = '';
let contacts: any[] = [];
let flightMode = false;
let lastMessages: any[] = [];
let calls: any[] = [];
let groups: any[] = [];
let wallpaper = '';
let password = '';
let ringtoneVolume = 100;
let scale = 0;

mp.events.add('ConfigureCellphone', (setCellphone: number, setFlightMode: boolean,
  setWallpaper: string, setRingtoneVolume: number, setPassword: string, setScale: number,
  contactsJson: string, lastMessagesJson: string, callsJson: string, groupsJson: string) => {
  cellphone = setCellphone;
  flightMode = setFlightMode;
  wallpaper = setWallpaper;
  ringtoneVolume = setRingtoneVolume;
  password = setPassword;
  scale = setScale;
  contacts = JSON.parse(contactsJson);
  lastMessages = JSON.parse(lastMessagesJson);
  calls = JSON.parse(callsJson);
  groups = JSON.parse(groupsJson);
});

const closeCellphone = () => {
  callRemoteEvent('CloseCellphone');
  setPages([], [Constants.PHONE_PAGE]);
  toggleView(false);
};

mp.events.add('CloseCellphone', closeCellphone);

mp.events.add('PhonePage:AddCallServer', (json: string) => {
  calls.unshift(JSON.parse(json));
  updateCalls();
});

mp.events.add('PhonePage:UpdateLastMessages', (json: string) => {
  lastMessages = JSON.parse(json);
  updateLastMessages();
});

mp.events.add('PhonePage:UpdateGroupsServer', (json: string) => {
  groups = JSON.parse(json);
  updateGroups();
});

mp.events.add('OpenCellphone', () => {
  configureEvent(Constants.PHONE_PAGE_SHOW, () => {
    updateCellphone();
    updateContacts();
    updateCalls();
    updateLastMessages();
    updateGroups();
    webView.call(Constants.PHONE_PAGE_SHOW, cellphone, flightMode, wallpaper, password, ringtoneVolume, scale);
  });

  setPages([Constants.PHONE_PAGE], []);

  configureEvent(Constants.PHONE_PAGE_CLOSE, closeCellphone);

  configureEvent(Constants.PHONE_PAGE_CREATE_UPDATE_CONTACT, (number: number, name: string, favorite: boolean, blocked: boolean) => {
    const found = contacts.find(x => x.number === number);
    if (found) {
      found.name = name;
      found.favorite = favorite;
      found.blocked = blocked;
    } else {
      contacts.push({
        number,
        name,
        favorite,
        blocked,
      });
    }
    callRemoteEvent('AddCellphoneContact', number, name, favorite, blocked);
    updateContacts();
  });

  configureEvent(Constants.PHONE_PAGE_REMOVE_CONTACT, (number: number) => {
    const found = contacts.find(x => x.number === number);
    if (found)
      contacts.splice(contacts.indexOf(found), 1);
    callRemoteEvent('RemoveCellphoneContact', number);
    updateContacts();
  });

  configureEvent(Constants.PHONE_PAGE_CALL_CONTACT, (number: number) => {
    callRemoteEvent('CallCellphone', number);
  });

  configureEvent(Constants.PHONE_PAGE_SEND_LOCATION, (numberOrGroup: string) => {
    callRemoteEvent('SendCellphoneLocation', numberOrGroup);
  });

  configureEvent(Constants.PHONE_PAGE_SAVE_SETTINGS, (setFlightMode: boolean, setWallpaper: string, setPassword: string,
    setRingtoneVolume: number, setScale: number) => {
    flightMode = setFlightMode;
    wallpaper = setWallpaper;
    password = setPassword;
    ringtoneVolume = setRingtoneVolume;
    scale = setScale;
    callRemoteEvent('CellphoneSaveSettings', flightMode, wallpaper, password, ringtoneVolume, scale);
  });

  configureEvent(Constants.PHONE_PAGE_END_CALL, () => {
    callRemoteEvent('EndCall');
  });

  configureEvent(Constants.PHONE_PAGE_SEND_MESSAGE, (numberOrGroup: string, message: string) => {
    callRemoteEvent('SendSMS', numberOrGroup, message);
  });

  configureEvent(Constants.PHONE_PAGE_ANSWER_CALL, () => {
    callRemoteEvent('AnswerCall');
  });

  configureEvent(Constants.PHONE_PAGE_READ_MESSAGES, (messagesJson: string) => {
    callRemoteEvent('ReadMessages', messagesJson);
  });

  configureEvent(Constants.PHONE_PAGE_CREATE_GROUP, (groupName: string, contactsJson: string) => {
    callRemoteEvent('CellphoneCreateGroup', groupName, contactsJson);
  });

  configureEvent(Constants.PHONE_PAGE_EXIT_GROUP, (groupId: string) => {
    callRemoteEvent('CellphoneGroupExit', groupId);
  });

  configureEvent(Constants.PHONE_PAGE_TRACK_LOCATION, (x: number, y: number) => {
    mp.game.ui.setNewWaypoint(x, y);
  });

  configureEvent(Constants.PHONE_PAGE_ADD_GROUP_MEMBERS, (groupId: string, membersJson: string) => {
    callRemoteEvent('CellphoneGroupAddMembers', groupId, membersJson);
  });

  configureEvent(Constants.PHONE_PAGE_TOGGLE_GROUP_MEMBER_PERMISSION, (groupId: string, number: number) => {
    callRemoteEvent('CellphoneGroupToggleMemberPermission', groupId, number);
  });

  configureEvent(Constants.PHONE_PAGE_REMOVE_GROUP_MEMBER, (groupId: string, number: number) => {
    callRemoteEvent('CellphoneGroupRemoveMember', groupId, number);
  });

  configureEvent(Constants.PHONE_PAGE_UPDATE_CHAT_MESSAGES, (numberOrGroupId: string, isGroup: boolean) => {
    callRemoteEvent('CellphoneGetChatMessages', numberOrGroupId, isGroup);
  });

  toggleView(true);
});

mp.events.add('PhonePage:EndCallServer', () => {
  webView.call(Constants.PHONE_PAGE_END_CALL);
})

mp.events.add('PhonePage:CallContactServer', (contact: string) => {
  webView.call(Constants.PHONE_PAGE_CALL_CONTACT, contact);
});

mp.events.add('PhonePage:AnswerCallServer', (contact: string) => {
  webView.call(Constants.PHONE_PAGE_ANSWER_CALL, contact);
});

mp.events.add('PhonePage:ReceiveCallServer', (contact: string) => {
  webView.call(Constants.PHONE_PAGE_RECEIVE_CALL, contact);
});

mp.events.add('PhonePage:CreateGroupServer', () => {
  webView.call(Constants.PHONE_PAGE_CREATE_GROUP);
});

mp.events.add(Constants.WEB_VIEW_END_LOADING, () => {
  webView.call(Constants.WEB_VIEW_END_LOADING);
});

mp.events.add('PhonePage:UpdateChatMessagesServer', (json: string) => {
  webView.call(Constants.PHONE_PAGE_UPDATE_CHAT_MESSAGES, json);
});

export function updateCellphone() {
  temperature = mp.players.local.getVariable('Temperature') as string;
  weather = mp.players.local.getVariable('WeatherType') as string;
  updateData();
}

function updateContacts() {
  contacts = contacts.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
  webView.call(Constants.PHONE_PAGE_UPDATE_CONTACTS, JSON.stringify(contacts));
}

function updateCalls() {
  webView.call(Constants.PHONE_PAGE_UPDATE_CALLS, JSON.stringify(calls));
}

function updateLastMessages() {
  webView.call(Constants.PHONE_PAGE_UPDATE_LAST_MESSAGES, JSON.stringify(lastMessages));
}

function updateGroups() {
  webView.call(Constants.PHONE_PAGE_UPDATE_GROUPS, JSON.stringify(groups));
}

function updateData() {
  let weatherType = 'sun';
  if (weather == 'CLEARING')
    weatherType = 'cloud-sun-rain';
  else if (weather == 'CLOUDS')
    weatherType = 'cloud';
  else if (weather == 'RAIN')
    weatherType = 'cloud-rain';
  else if (weather == 'THUNDER' || weather == 'OVERCAST')
    weatherType = 'bolt';
  else if (weather == 'FOGGY')
    weatherType = 'wind';
  else if (weather == 'SMOG')
    weatherType = 'smog';
  else if (weather == 'SNOW' || weather == 'BLIZZARD')
    weatherType = 'snowflake';

  webView.call(Constants.PHONE_PAGE_UPDATE_INFO, temperature, weatherType);
}