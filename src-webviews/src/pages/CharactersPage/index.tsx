import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import './style.scss';
import { configureEvent, emitEvent, formatDateTime, formatValue } from '../../services/util';
import { ReloadOutlined, RightCircleOutlined, UserOutlined } from '@ant-design/icons';
import React from 'react';
import { Tag } from 'antd';

enum CharacterStatus {
  Alive = 1,
  CKAvaliation = 2,
  Dead = 3,
  Rejected = 4,
  AwaitingEvaluation = 5,
};

interface Character {
  id: string;
  name: string;
  deathReason: string;
  status: CharacterStatus;
  lastAccessDate: Date;
  connectedTime: number;
  faction: string,
  job: string
};

const CharactersPage = () => {
  const [loading, setLoading] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState<Character>();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [slots, setSlots] = useState(0);
  const [hoveredCharacter, setHoveredCharacter] = useState('')

  useEffect(() => {
    // setLoading(false)
    // setSlots(3)
    // setCharacters([{
    //   connectedTime: 12,
    //   deathReason: '',
    //   faction: '',
    //   id: '1',
    //   job: '1',
    //   lastAccessDate: new Date(),
    //   name: 'Name',
    //   status: CharacterStatus.Alive,
    // }])
    configureEvent(Constants.CHARACTERS_PAGE_SHOW, (charactersJson: string, slots: number) => {
      const characters = JSON.parse(charactersJson);
      setCharacters(characters);
      setSlots(Math.max(characters.length, slots));
      setSelectedCharacter(undefined);
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.CHARACTERS_PAGE_SHOW);
  }, []);

  const connect = () => {
    if (selectedCharacter?.status != CharacterStatus.Alive && selectedCharacter?.status != CharacterStatus.Rejected)
      return;

    setLoading(true);
    emitEvent(Constants.CHARACTERS_PAGE_SELECT_CHARACTER, selectedCharacter.id);
  };

  const refresh = () => {
    setLoading(true);
    emitEvent(Constants.CHARACTERS_PAGE_REFRESH);
  };

  const CharacterStatusTag = ({ character }: { character: Character }) => {
    if (character.status == CharacterStatus.CKAvaliation)
      return <Tag color={'yellow'}>{t('ckAvaliation')}</Tag>;

    if (character.status == CharacterStatus.Dead)
      return <Tag color={'red'}>{t('dead')} ({character.deathReason})</Tag>;

    if (character.status == CharacterStatus.Rejected)
      return <Tag color={'yellow'}>{t('rejected')}</Tag>;

    if (character.status == CharacterStatus.AwaitingEvaluation)
      return <Tag color={'yellow'}>{t('awaitingEvaluation')}</Tag>;

    return <Tag color={'green'}>{t('alive')}</Tag>;
  }

  return <div id="charactersPage">
    <div className='bgPageCentered'>
      <div className="card">
        <div className='leftRefreshButtonContainer'>
          <button disabled={loading} onClick={refresh}>
            <ReloadOutlined />
          </button>
        </div>
        <div className="card-body">
          <div className='card-logo fullPadding'>
            <div className="header-logo" />
          </div>
          <div className='card-content'>
            <div className='title-row defaultPadding'>
              <span><strong>{t("selectYourCharacter")}</strong></span>
              <div className='subText'>
                <UserOutlined />
                <span>({characters.length}/{slots})</span>
              </div>
            </div>
            <hr />
            <div className="charactersList" hidden={loading}>
              {
                characters.map((item, i) => {
                  return (
                    <React.Fragment key={i}>
                      <div
                        className="characterItem defaultPadding"
                        onClick={() => setSelectedCharacter(item)}
                        onMouseEnter={() => setHoveredCharacter(item.id)}
                        onMouseLeave={() => setHoveredCharacter('')}
                      >
                        <input type='radio' checked={selectedCharacter?.id == item.id} />
                        <div className='characterCenterContainer'>
                          <span className='characterName'>
                            {item.name}
                          </span>
                          <span className='characterTimePlayed'>
                            <CharacterStatusTag character={item} />
                          </span>
                        </div>
                        <div className="characterHoverBox" hidden={hoveredCharacter != item.id}>
                          <span className='hoverBoxLabel'>{t("name")}</span>
                          <span>
                            {item.name}
                          </span>
                          <hr />
                          <span className='hoverBoxLabel'>{t("playedTime")}</span>
                          <span>
                            {formatValue(item.connectedTime)} {t(item.connectedTime === 1 ? "hour" : "hours").toLowerCase()}
                          </span>
                          <hr />
                          <span className='hoverBoxLabel'>{t("faction")}</span>
                          <span>
                            {item.faction}
                          </span>
                          <hr />
                          <span className='hoverBoxLabel'>{t("job")}</span>
                          <span>
                            {item.job}
                          </span>
                          <hr />
                          <span className='hoverBoxLabel'>{t("lastAccess")}</span>
                          <span>
                            {formatDateTime(item.lastAccessDate)}
                          </span>
                        </div>
                      </div>
                      <hr />
                    </React.Fragment>
                  )
                })
              }
              <div className='characterListBtnGroup fullPadding'>
                <button className='primaryButton fw' onClick={connect} disabled={!selectedCharacter || loading}>
                  {t('enterServer')} <RightCircleOutlined />
                </button>
              </div>
            </div>
            <div className="loadingContainer" hidden={!loading}>
              <div className="spinner-border" role="status">
                <span className="visually-hidden"></span>
              </div><br />
              <span>{t('loading')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
};

export default CharactersPage;