declare module 'react-native-global-props' {
  import {TextProps, TextInputProps} from 'react-native';

  export function setCustomText(customProps: TextProps): void;
  export function setCustomTextInput(customProps: TextInputProps): void;
}
