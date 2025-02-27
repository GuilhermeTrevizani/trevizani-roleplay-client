import { ForensicTestItemType } from './ForensicTestItemType';
import SelectOption from './SelectOption';

export default interface ForensicTestItem {
  type: ForensicTestItemType;
  originConfiscationItemId: string;
  targetConfiscationItemId?: string;
  firstItem: string;
  secondItem?: string;
  identifier: string;
  firstConfiscation?: string;
  secondConfiscation?: string;
  firstConfiscationItems: SelectOption[];
  secondConfiscationItems: SelectOption[];
};