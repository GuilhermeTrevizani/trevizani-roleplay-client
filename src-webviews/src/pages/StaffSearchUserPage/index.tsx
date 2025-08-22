import { Button, Col, Form, List, Modal, Row, Select } from 'antd';
import { configureEvent, emitEvent, formatDateTime } from '../../services/util';
import { Constants } from '../../../../src/base/constants';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import SelectOption from '../../types/SelectOption';
import { Staff } from '../../types/Staff';
import Title from 'antd/es/typography/Title';
import Text from 'antd/es/typography/Text';
import { StaffFlag } from '../../types/StaffFlag';

interface User {
  id: string;
  name: string;
  staff: Staff;
  staffFlags: StaffFlag[];
  characters: UserCharacter[];
  punishments: UserPunishment[];
};

interface UserCharacter {
  name: string;
};

interface UserPunishment {
  character: string;
  registerDate: Date;
  type: string;
  duration: number;
  staff: string;
  reason: string;
};

const StaffSearchUserPage = () => {
  const [loading, setLoading] = useState(true);
  const [userStaffOptions, setUserStaffOptions] = useState<SelectOption[]>([]);
  const [staffFlagOptions, setStaffFlagOptions] = useState<SelectOption[]>([]);
  const [userStaff, setUserStaff] = useState<Staff>();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    // setUser({
    //   id: '1',
    //   name: 'Trevizani',
    //   staff: Staff.GameAdmin,
    //   staffFlags: [],
    //   punishments: [{
    //     character: 'Stephen Rundle',
    //     duration: 12,
    //     reason: 'Motivo',
    //     registerDate: new Date(),
    //     staff: 'Trevizani',
    //     type: 'Ban'
    //   }],
    //   characters: [{
    //     name: 'Stephen Rundle',
    //   }]
    // });
    // setStaffFlagOptions([{
    //   label: 'Veículos',
    //   value: '1'
    // }])
    configureEvent(Constants.STAFF_SEARCH_USER_PAGE_SHOW, (userStaffOptionsJson: string, staffFlagOptionsJson: string, userStaff: Staff, userJson: string) => {
      setUserStaffOptions(JSON.parse(userStaffOptionsJson));
      setStaffFlagOptions(JSON.parse(staffFlagOptionsJson));
      setUserStaff(userStaff);
      setUser(JSON.parse(userJson));
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.STAFF_SEARCH_USER_PAGE_SHOW);
  }, []);

  const handleCancel = () => {
    emitEvent(Constants.STAFF_SEARCH_USER_PAGE_CLOSE);
  };

  const saveUser = () => {
    setLoading(true);
    emitEvent(Constants.STAFF_SEARCH_USER_PAGE_SAVE, user.id, user.staff, JSON.stringify(user.staffFlags));
  };

  const getPunishmentDuration = (punishment: UserPunishment) => {
    if (punishment.type === 'Kick')
      return 'N/A';

    if (punishment.duration === 0)
      return t('permanent');

    return `${punishment.duration} ${t(punishment.duration === 1 ? 'day' : 'days').toLowerCase()}`;
  };

  if (!user)
    return <></>

  return <Modal open={true} title={user.name} onCancel={handleCancel} footer={null} width={'90%'}>
    <div style={{ maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}>
      <Form layout='vertical'>
        <Row gutter={16}>
          <Col span={4}>
            <Form.Item label={t('staff')}>
              <Select options={userStaffOptions} value={user.staff}
                onChange={(value) => setUser({ ...user, staff: value })} disabled={userStaff < Staff.Management} />
            </Form.Item>
          </Col>
          <Col span={18}>
            <Form.Item label={t('flags')}>
              <Select mode='multiple' options={staffFlagOptions} value={user.staffFlags}
                onChange={(value) => setUser({ ...user, staffFlags: value })} disabled={userStaff < Staff.Management}
                optionFilterProp='label' />
            </Form.Item>
          </Col>
          <Col span={2}>
            <Form.Item label={' '}>
              <Button style={{ width: '100%' }} onClick={saveUser} loading={loading} disabled={userStaff < Staff.Management}>{t('save')}</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Title level={5}>{t('characters')}</Title>
      <List
        bordered
        dataSource={user.characters}
        renderItem={(item) => (
          <List.Item>
            <Text>{item.name}</Text>
          </List.Item>
        )}
      />
      <Title level={5} style={{ marginTop: '10px' }}>{t('administrativePunishments')}</Title>
      <List
        bordered
        dataSource={user.punishments}
        renderItem={(item) => (
          <List.Item>
            <Text>{t('character')}: <strong>{item.character}</strong> {t('date')}: <strong>{formatDateTime(item.registerDate)}</strong> {t('type')}: <strong>{item.type}</strong> {t('duration')}: <strong>{getPunishmentDuration(item)}</strong> {t('staff')}: <strong>{item.staff}</strong> {t('reason')}: <strong>{item.reason}</strong></Text>
          </List.Item>
        )}
      />
    </div>
  </Modal>
};

export default StaffSearchUserPage;