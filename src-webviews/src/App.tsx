import { useEffect, useState } from 'react';
import { Constants } from '../../src/base/constants';
import LoginPage from './pages/LoginPage';
import CharactersPage from './pages/CharactersPage';
import ChatPage from './pages/ChatPage';
import PlayerListPage from './pages/PlayerListPage';
import CompanyBuyItemsPage from './pages/CompanyBuyItemsPage';
import DealershipPage from './pages/DealershipPage';
import PropertyUpgradePage from './pages/PropertyUpgradePage';
import VehicleListPage from './pages/VehicleListPage';
import HUDPage from './pages/HUDPage';
import BoomboxPage from './pages/BoomboxPage';
import CharacterWoundsPage from './pages/CharacterWoundsPage';
import VehicleDamagesPage from './pages/VehicleDamagesPage';
import BanishmentInfoPage from './pages/BanishmentInfoPage';
import CrackDenSalesPage from './pages/CrackDenSalesPage';
import TruckerLocationsPage from './pages/TruckerLocationsPage';
import FactionVehiclesPage from './pages/FactionVehiclesPage';
import DropItemPage from './pages/DropItemPage';
import PropertyFurnituresPage from './pages/PropertyFurnituresPage';
import { configureEvent, emitEvent } from './services/util';
import CompaniesPage from './pages/CompaniesPage';
import CompanyCharactersPage from './pages/CompanyCharactersPage';
import ConfiscationPage from './pages/ConfiscationPage';
import CrackDenPage from './pages/CrackDenPage';
import FactionStoragePage from './pages/FactionStoragePage';
import VehicleTuningPage from './pages/VehicleTuningPage';
import TattoosPage from './pages/TattoosPage';
import ClothesPage from './pages/ClothesPage';
import CharCreatorPage from './pages/CharCreatorPage';
import BankPage from './pages/BankPage';
import MDCPage from './pages/MDCPage';
import StaffBlipPage from './pages/StaffBlipPage';
import StaffCompanyPage from './pages/StaffCompanyPage';
import StaffCrackDenPage from './pages/StaffCrackDenPage';
import StaffCrackDenItemPage from './pages/StaffCrackDenItemPage';
import StaffDoorPage from './pages/StaffDoorPage';
import StaffFactionStorageItemPage from './pages/StaffFactionStorageItemPage';
import StaffFactionStoragePage from './pages/StaffFactionStoragePage';
import StaffGiveItemPage from './pages/StaffGiveItemPage';
import StaffTruckerLocationPage from './pages/StaffTruckerLocationPage';
import StaffTruckerLocationDeliveryPage from './pages/StaffTruckerLocationDeliveryPage';
import InfoPage from './pages/InfoPage';
import StaffInfoPage from './pages/StaffInfoPage';
import StaffJobPage from './pages/StaffJobPage';
import StaffPropertyPage from './pages/StaffPropertyPage';
import StaffSpotPage from './pages/StaffSpotPage';
import StaffSearchUserPage from './pages/StaffSearchUserPage';
import InventoryPage from './pages/InventoryPage';
import AjailInfoPage from './pages/AjailInfoPage';
import StaffDealershipPage from './pages/StaffDealershipPage';
import StaffDealershipVehiclePage from './pages/StaffDealershipVehiclePage';
import AudioPage from './pages/AudioPage';
import { ConfigProvider, theme } from 'antd';
import StaffSmugglerPage from './pages/StaffSmugglerPage';
import PickLockPage from './pages/PickLockPage';
import AnimationPage from './pages/AnimationPage';
import ImagePage from './pages/ImagePage';
import StaffPropertyEntrancePage from './pages/StaffPropertyEntrancePage';
import PropertyBuildingPage from './pages/PropertyBuildingPage';
import StaffCompanyItemPage from './pages/StaffCompanyItemPage';
import CompanyItemsPage from './pages/CompanyItemsPage';
import StaffCompanyTuningPricePage from './pages/StaffCompanyTuningPricePage';
import CompanyTuningPricesPage from './pages/CompanyTuningPricesPage';
import CircleMinigamePage from './pages/CircleMinigamePage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import GraffitiCommandsPage from './pages/GraffitiCommandsPage';
import GraffitiPage from './pages/GraffitiPage';
import StaffGraffitiPage from './pages/StaffGraffitiPage';
import TVPage from './pages/TVPage';
import TVConfigPage from './pages/TVConfigPage';
import MorguePage from './pages/MorguePage';
import WeaponBodyPage from './pages/WeaponBodyPage';
import PhonePage from './pages/PhonePage';
import ForensicLaboratoryPage from './pages/ForensicLaboratoryPage';
import PremiumStorePage from './pages/PremiumStorePage';
import SettingsPage from './pages/SettingsPage';
import StatsPage from './pages/StatsPage';
import HelpPage from './pages/HelpPage';
import StaffObjectPage from './pages/StaffObjectPage';
import StaffSearchCharacterPage from './pages/StaffSearchCharacterPage';
import DeathPage from './pages/DeathPage';
import FirePage from './pages/FirePage';
import OutfitsPage from './pages/OutfitsPage';
import AttributesPage from './pages/AttributesPage';
import AnimationHelpPage from './pages/AnimationHelpPage';
import moment from 'moment';

moment.locale('pt-br');

function App() {
  const [visiblePages, setVisiblePages] = useState<string[]>([]);

  useEffect(() => {
    configureEvent(Constants.WEB_VIEW_SET_PAGES, (addPagesJson: string, removePagesJson: string) => {
      const addPages = JSON.parse(addPagesJson);
      const removePages = JSON.parse(removePagesJson);
      setVisiblePages(old => [
        ...old.filter(x => !removePages.includes(x)),
        ...addPages
      ]);
    });

    configureEvent(Constants.WEB_VIEW_SET_DEBUG, (debug: boolean) => {
      Constants.DEBUG = debug;
    });

    configureEvent(Constants.WEB_VIEW_GET_SCREEN, (targetId: number, url: string) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        const reader = new FileReader();
        reader.onloadend = function () {
          const result = reader.result as string;
          const array = result.match(/.{1,15000}/g);
          array.forEach((value, index) => {
            emitEvent('SendScreenTarget', targetId, value, index, array.length);
          });
        };
        reader.readAsDataURL(xhr.response);
      }
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.send();
    });
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: { colorPrimary: '#1097e6' },
      }}
    >
      <ChatPage visiblePages={visiblePages} />
      <AudioPage />
      {visiblePages.includes(Constants.LOGIN_PAGE) && <LoginPage />}
      {visiblePages.includes(Constants.CHARACTERS_PAGE) && <CharactersPage />}
      {visiblePages.includes(Constants.PLAYER_LIST_PAGE) && <PlayerListPage />}
      {visiblePages.includes(Constants.COMPANY_BUY_ITEMS_PAGE) && <CompanyBuyItemsPage />}
      {visiblePages.includes(Constants.DEALERSHIP_PAGE) && <DealershipPage />}
      {visiblePages.includes(Constants.PROPERTY_UPGRADE_PAGE) && <PropertyUpgradePage />}
      {visiblePages.includes(Constants.VEHICLE_LIST_PAGE) && <VehicleListPage />}
      {visiblePages.includes(Constants.CHAT_PAGE) && <HUDPage />}
      {visiblePages.includes(Constants.BOOMBOX_PAGE) && <BoomboxPage />}
      {visiblePages.includes(Constants.CHARACTER_WOUNDS_PAGE) && <CharacterWoundsPage />}
      {visiblePages.includes(Constants.VEHICLE_DAMAGES_PAGE) && <VehicleDamagesPage />}
      {visiblePages.includes(Constants.BANISHMENT_INFO_PAGE) && <BanishmentInfoPage />}
      {visiblePages.includes(Constants.CRACK_DEN_SALES_PAGE) && <CrackDenSalesPage />}
      {visiblePages.includes(Constants.TRUCKER_LOCATIONS_PAGE) && <TruckerLocationsPage />}
      {visiblePages.includes(Constants.FACTION_VEHICLES_PAGE) && <FactionVehiclesPage />}
      {visiblePages.includes(Constants.DROP_ITEM_PAGE) && <DropItemPage />}
      {visiblePages.includes(Constants.PROPERTY_FURNITURES_PAGE) && <PropertyFurnituresPage />}
      {visiblePages.includes(Constants.COMPANIES_PAGE) && <CompaniesPage />}
      {visiblePages.includes(Constants.COMPANY_CHARACTERS_PAGE) && <CompanyCharactersPage />}
      {visiblePages.includes(Constants.CONFISCATION_PAGE) && <ConfiscationPage />}
      {visiblePages.includes(Constants.CRACK_DEN_PAGE) && <CrackDenPage />}
      {visiblePages.includes(Constants.FACTION_STORAGE_PAGE) && <FactionStoragePage />}
      {visiblePages.includes(Constants.VEHICLE_TUNING_PAGE) && <VehicleTuningPage />}
      {visiblePages.includes(Constants.TATTOOS_PAGE) && <TattoosPage />}
      {visiblePages.includes(Constants.CLOTHES_PAGE) && <ClothesPage />}
      {visiblePages.includes(Constants.CHAR_CREATOR_PAGE) && <CharCreatorPage />}
      {visiblePages.includes(Constants.BANK_PAGE) && <BankPage />}
      {visiblePages.includes(Constants.MDC_PAGE) && <MDCPage />}
      {visiblePages.includes(Constants.STAFF_BLIP_PAGE) && <StaffBlipPage />}
      {visiblePages.includes(Constants.STAFF_COMPANY_PAGE) && <StaffCompanyPage />}
      {visiblePages.includes(Constants.STAFF_CRACK_DEN_PAGE) && <StaffCrackDenPage />}
      {visiblePages.includes(Constants.STAFF_CRACK_DEN_ITEM_PAGE) && <StaffCrackDenItemPage />}
      {visiblePages.includes(Constants.STAFF_DOOR_PAGE) && <StaffDoorPage />}
      {visiblePages.includes(Constants.STAFF_FACTION_STORAGE_PAGE) && <StaffFactionStoragePage />}
      {visiblePages.includes(Constants.STAFF_FACTION_STORAGE_ITEM_PAGE) && <StaffFactionStorageItemPage />}
      {visiblePages.includes(Constants.STAFF_GIVE_ITEM_PAGE) && <StaffGiveItemPage />}
      {visiblePages.includes(Constants.STAFF_TRUCKER_LOCATION_PAGE) && <StaffTruckerLocationPage />}
      {visiblePages.includes(Constants.STAFF_TRUCKER_LOCATION_DELIVERY_PAGE) && <StaffTruckerLocationDeliveryPage />}
      {visiblePages.includes(Constants.STAFF_INFO_PAGE) && <StaffInfoPage />}
      {visiblePages.includes(Constants.INFO_PAGE) && <InfoPage />}
      {visiblePages.includes(Constants.STAFF_JOB_PAGE) && <StaffJobPage />}
      {visiblePages.includes(Constants.STAFF_PROPERTY_PAGE) && <StaffPropertyPage />}
      {visiblePages.includes(Constants.STAFF_SPOT_PAGE) && <StaffSpotPage />}
      {visiblePages.includes(Constants.INVENTORY_PAGE) && <InventoryPage />}
      {visiblePages.includes(Constants.AJAIL_INFO_PAGE) && <AjailInfoPage />}
      {visiblePages.includes(Constants.STAFF_DEALERSHIP_PAGE) && <StaffDealershipPage />}
      {visiblePages.includes(Constants.STAFF_DEALERSHIP_VEHICLE_PAGE) && <StaffDealershipVehiclePage />}
      {visiblePages.includes(Constants.STAFF_SMUGGLER_PAGE) && <StaffSmugglerPage />}
      {visiblePages.includes(Constants.PICK_LOCK_PAGE) && <PickLockPage />}
      {visiblePages.includes(Constants.ANIMATION_PAGE) && <AnimationPage />}
      {visiblePages.includes(Constants.IMAGE_PAGE) && <ImagePage />}
      {visiblePages.includes(Constants.STAFF_PROPERTY_ENTRANCE_PAGE) && <StaffPropertyEntrancePage />}
      {visiblePages.includes(Constants.PROPERTY_BUILDING_PAGE) && <PropertyBuildingPage />}
      {visiblePages.includes(Constants.STAFF_COMPANY_ITEM_PAGE) && <StaffCompanyItemPage />}
      {visiblePages.includes(Constants.COMPANY_ITEMS_PAGE) && <CompanyItemsPage />}
      {visiblePages.includes(Constants.STAFF_COMPANY_TUNING_PRICE_PAGE) && <StaffCompanyTuningPricePage />}
      {visiblePages.includes(Constants.COMPANY_TUNING_PRICES_PAGE) && <CompanyTuningPricesPage />}
      {visiblePages.includes(Constants.CIRCLE_MINIGAME_PAGE) && <CircleMinigamePage />}
      {visiblePages.includes(Constants.ANNOUNCEMENTS_PAGE) && <AnnouncementsPage />}
      {visiblePages.includes(Constants.GRAFFITI_COMMANDS_PAGE) && <GraffitiCommandsPage />}
      {visiblePages.includes(Constants.GRAFFITI_PAGE) && <GraffitiPage />}
      {visiblePages.includes(Constants.STAFF_GRAFFITI_PAGE) && <StaffGraffitiPage />}
      {visiblePages.includes(Constants.TV_PAGE) && <TVPage />}
      {visiblePages.includes(Constants.TV_CONFIG_PAGE) && <TVConfigPage />}
      {visiblePages.includes(Constants.MORGUE_PAGE) && <MorguePage />}
      {visiblePages.includes(Constants.WEAPON_BODY_PAGE) && <WeaponBodyPage />}
      {visiblePages.includes(Constants.PHONE_PAGE) && <PhonePage />}
      {visiblePages.includes(Constants.FORENSIC_LABORATORY_PAGE) && <ForensicLaboratoryPage />}
      {visiblePages.includes(Constants.PREMIUM_STORE_PAGE) && <PremiumStorePage />}
      {visiblePages.includes(Constants.SETTINGS_PAGE) && <SettingsPage />}
      {visiblePages.includes(Constants.STATS_PAGE) && <StatsPage />}
      {visiblePages.includes(Constants.HELP_PAGE) && <HelpPage />}
      {visiblePages.includes(Constants.STAFF_OBJECT_PAGE) && <StaffObjectPage />}
      {visiblePages.includes(Constants.STAFF_SEARCH_USER_PAGE) && <StaffSearchUserPage />}
      {visiblePages.includes(Constants.STAFF_SEARCH_CHARACTER_PAGE) && <StaffSearchCharacterPage />}
      {visiblePages.includes(Constants.DEATH_PAGE) && <DeathPage />}
      {visiblePages.includes(Constants.FIRE_PAGE) && <FirePage />}
      {visiblePages.includes(Constants.OUTFITS_PAGE) && <OutfitsPage />}
      {visiblePages.includes(Constants.ATTRIBUTES_PAGE) && <AttributesPage />}
      {visiblePages.includes(Constants.ANIMATION_HELP_PAGE) && <AnimationHelpPage />}
    </ConfigProvider>
  );
}

export default App;