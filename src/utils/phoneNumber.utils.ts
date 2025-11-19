import { Logger } from '@nestjs/common';
import * as phoneUtil from 'google-libphonenumber';
import { CountryRegion } from 'src/enums/countryCodes';

export class PhoneNumberUtil {
  static logger = new Logger(PhoneNumberUtil.name);
  /*
 * country code is defaulted to +234 for now,
 * this will be modified in future as we expand 

 */
  static validatePhoneNumber(
    phoneNumber: string,
    region = CountryRegion.NG,
  ): boolean | string {
    const phoneParser = phoneUtil.PhoneNumberUtil.getInstance();
    const number = phoneParser.parseAndKeepRawInput(phoneNumber, region);

    // return false if phone number is not valid
    if (!phoneParser.isValidNumber(number)) {
      this.logger.error('Invalid phone number \n', phoneNumber);
      return;
    }

    return phoneParser.format(number, phoneUtil.PhoneNumberFormat.E164);
  }
}
