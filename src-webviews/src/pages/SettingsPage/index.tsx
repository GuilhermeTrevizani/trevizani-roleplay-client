import { Checkbox, Col, ColorPicker, Form, InputNumber, Modal, Row, Select } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { configureEvent, emitEvent } from '../../services/util';
import SelectOption from '../../types/SelectOption';

interface UCPSettings {
  timeStampToggle: boolean;
  announcementToggle: boolean;
  pmToggle: boolean;
  factionChatToggle: boolean;
  staffChatToggle: boolean;
  chatFontType: number;
  chatLines: number;
  chatFontSize: number;
  factionToggle: boolean;
  vehicleTagToggle: boolean;
  chatBackgroundColor: string;
  showNametagId: boolean;
  ambientSoundToggle: boolean;
  freezingTimePropertyEntrance: number;
  showOwnNametag: boolean;
  staffToggle: boolean;
  factionWalkieTalkieToggle: boolean;
  receiveSMSDiscord: number;
};

interface Character {
  hasFaction: boolean;
  isStaff: boolean;
  isPremium: boolean;
}

const SettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<UCPSettings>({
    announcementToggle: false,
    chatFontSize: 0,
    chatFontType: 0,
    chatLines: 0,
    factionChatToggle: false,
    factionToggle: false,
    pmToggle: false,
    staffChatToggle: false,
    timeStampToggle: false,
    vehicleTagToggle: false,
    chatBackgroundColor: '000000',
    showNametagId: false,
    ambientSoundToggle: false,
    freezingTimePropertyEntrance: 0,
    showOwnNametag: false,
    staffToggle: false,
    factionWalkieTalkieToggle: false,
    receiveSMSDiscord: 1,
  });
  const [character, setCharacter] = useState<Character>({
    isPremium: false,
    isStaff: false,
    hasFaction: false,
  });
  const [receiveSMSDiscordOptions, setReceiveSMSDiscordOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    configureEvent(Constants.SETTINGS_PAGE_SHOW, (settingsJson: string, characterJson: string, receiveSMSDiscordOptionsJson: string) => {
      setSettings(JSON.parse(settingsJson));
      setCharacter(JSON.parse(characterJson));
      setReceiveSMSDiscordOptions(JSON.parse(receiveSMSDiscordOptionsJson));
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.SETTINGS_PAGE_SHOW);
  }, []);

  const handleCancel = () => {
    emitEvent(Constants.SETTINGS_PAGE_CLOSE);
  };

  const save = () => {
    setLoading(true);
    emitEvent(Constants.SETTINGS_PAGE_SAVE, JSON.stringify(settings));
  };

  const inputStyle = {
    width: '100%',
  };

  return <Modal open={true} title={t('settings')} onCancel={handleCancel} width={'50%'}
    okText={t('save')} cancelText={t('close')} onOk={save} confirmLoading={loading}
  >
    <Form layout='vertical' style={{ maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label={t('chatFontType')}>
            <Select value={settings.chatFontType} onChange={(value) => setSettings({ ...settings, chatFontType: value })}
              options={[
                { value: 0, label: "Arial, Helvetica, sans-serif" },
                { value: 1, label: "Georgia, 'Times New Roman', Times, serif" },
                { value: 2, label: "'Times New Roman', Times, serif" },
                { value: 3, label: "'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif" },
                { value: 4, label: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
                { value: 5, label: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif" },
                { value: 6, label: "'Monospaced', sans-serif" },
              ]}
              style={inputStyle} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label={t('chatFontSize')}>
            <InputNumber value={settings.chatFontSize} onChange={(value) => setSettings({ ...settings, chatFontSize: value })} style={inputStyle} min={12} max={26} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label={t('chatLines')}>
            <InputNumber value={settings.chatLines} onChange={(value) => setSettings({ ...settings, chatLines: value })} style={inputStyle} min={10} max={40} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label={t('chatBackgroundColor')}>
            <ColorPicker defaultValue="#000000" value={`#${settings.chatBackgroundColor}`}
              onChange={(value) => setSettings({ ...settings, chatBackgroundColor: value.toHexString().replace('#', '') })}
              style={inputStyle} disabledAlpha />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={t('freezingTimePropertyEntrance')}>
            <InputNumber value={settings.freezingTimePropertyEntrance} onChange={(value) => setSettings({ ...settings, freezingTimePropertyEntrance: value })} style={inputStyle} min={0} max={10} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={t('receiveSMSDiscord')}>
            <Select value={settings.receiveSMSDiscord} onChange={(value) => setSettings({ ...settings, receiveSMSDiscord: value })}
              options={receiveSMSDiscordOptions}
              style={inputStyle} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Checkbox checked={settings.timeStampToggle} onChange={(e) => setSettings({ ...settings, timeStampToggle: e.target.checked })}>{t('timeStampToggle')}</Checkbox>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Checkbox checked={settings.vehicleTagToggle} onChange={(e) => setSettings({ ...settings, vehicleTagToggle: e.target.checked })}>{t('vehicleTagToggle')}</Checkbox>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Checkbox checked={settings.announcementToggle} onChange={(e) => setSettings({ ...settings, announcementToggle: e.target.checked })}>{t('announcementToggle')}</Checkbox>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Checkbox checked={settings.showNametagId} onChange={(e) => setSettings({ ...settings, showNametagId: e.target.checked })}>{t('showNametagId')}</Checkbox>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Checkbox checked={settings.showOwnNametag} onChange={(e) => setSettings({ ...settings, showOwnNametag: e.target.checked })}>{t('showOwnNametag')}</Checkbox>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Checkbox checked={settings.ambientSoundToggle} onChange={(e) => setSettings({ ...settings, ambientSoundToggle: e.target.checked })}>{t('ambientSoundToggle')}</Checkbox>
        </Col>
      </Row>
      {character.isPremium && <Row gutter={16}>
        <Col span={24}>
          <Checkbox checked={settings.pmToggle} onChange={(e) => setSettings({ ...settings, pmToggle: e.target.checked })}>{t('pmToggle')}</Checkbox>
        </Col>
      </Row>}
      {character.hasFaction && <>
        <Row gutter={16}>
          <Col span={24}>
            <Checkbox checked={settings.factionChatToggle} onChange={(e) => setSettings({ ...settings, factionChatToggle: e.target.checked })}>{t('factionChatToggle')}</Checkbox>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Checkbox checked={settings.factionToggle} onChange={(e) => setSettings({ ...settings, factionToggle: e.target.checked })}>{t('factionToggle')}</Checkbox>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Checkbox checked={settings.factionWalkieTalkieToggle} onChange={(e) => setSettings({ ...settings, factionWalkieTalkieToggle: e.target.checked })}>{t('factionWalkieTalkieToggle')}</Checkbox>
          </Col>
        </Row>
      </>}
      {character.isStaff && <>
        <Row gutter={16}>
          <Col span={24}>
            <Checkbox checked={settings.staffToggle} onChange={(e) => setSettings({ ...settings, staffToggle: e.target.checked })}>{t('staffToggle')}</Checkbox>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Checkbox checked={settings.staffChatToggle} onChange={(e) => setSettings({ ...settings, staffChatToggle: e.target.checked })}>{t('staffChatToggle')}</Checkbox>
          </Col>
        </Row>
      </>}
    </Form>
  </Modal>
};

export default SettingsPage;