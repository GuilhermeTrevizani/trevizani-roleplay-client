
import { configureEvent, setPages, webView, toggleView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

const atms = ['prop_atm_01', 'prop_atm_02', 'prop_atm_03', 'prop_fleeca_atm'];

mp.events.add('ATMCheck', () => {
  let temAtmPerto = false;
  atms.forEach(atm => {
    if (temAtmPerto)
      return;

    const object = mp.game.object.getClosestOfType(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z,
      1.0, mp.game.joaat(atm), false, false, false);
    temAtmPerto = object != 0;
  });

  callRemoteEvent('ATMUse', temAtmPerto);
});

mp.events.add('BankShow', (update: boolean, atm: boolean, bankAccount: number, name: string, accountAmount: number,
  finesJson: string, transactionsJson: string) => {
  if (update) {
    webView.call(Constants.BANK_PAGE_UPDATE, accountAmount, finesJson, transactionsJson);
    return;
  }

  setPages([Constants.BANK_PAGE], []);
  configureEvent(Constants.BANK_PAGE_SHOW, () => {
    webView.call(Constants.BANK_PAGE_SHOW, atm, bankAccount, name, accountAmount, finesJson, transactionsJson);
  });
  configureEvent(Constants.BANK_PAGE_CLOSE, () => {
    setPages([], [Constants.BANK_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.BANK_PAGE_DEPOSIT, (value) => {
    callRemoteEvent('BankDeposit', value);
  });
  configureEvent(Constants.BANK_PAGE_WITHDRAW, (value) => {
    callRemoteEvent('BankWithdraw', value);
  });
  configureEvent(Constants.BANK_PAGE_TRANSFER, (bankAccount, value, description, confirm) => {
    callRemoteEvent('BankTransfer', bankAccount, value, description, confirm);
  });
  configureEvent(Constants.BANK_PAGE_PAY_FINE, (id) => {
    callRemoteEvent('BankPoliceTicketPayment', id);
  });
  toggleView(true);
});

mp.events.add('BankTransferConfirm', (name) => {
  webView.call(Constants.BANK_PAGE_TRANSFER, name);
});