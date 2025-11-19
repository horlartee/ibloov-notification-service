export interface IOneSignalPush {
  app_id?: string;

  //Example: {"en": "English Message", "es": "Spanish Message"}
  contents: Record<string, unknown>;

  //Example: {"en": "English Title", "es": "Spanish Title"}
  headings?: Record<string, unknown>;

  /**
   * Example: {"en": "English Subtitle", "es": "Spanish Subtitle"}
   * iOS 10+ only
   */
  subtitle?: Record<string, unknown>;

  /**
   * Use a template you setup on our dashboard. The template_id is the UUID found in the URL when viewing a template on our dashboard.
   * Example: be4a8044-bbd6-11e4-a581-000c2940e62c
   */
  template_id?: string;

  /**
   * Indicates the message type when targeting with include_external_user_ids for cases where an email, sms, and/or push subscribers have the same external user id.
   * Example: Use the string "push" to indicate you are sending a push notification or the string "email"for sending emails or "sms"for sending SMS.
   */
  channel_for_external_user_ids?: string;

  /**
   * The segment names you want to target. Users in these segments will receive a notification.
   * NB: This targeting parameter is only compatible with excluded_segments.
   * Example: ["Active Users", "Inactive Users"]
   */
  included_segments?: Array<string>;

  /**
   * Segment that will be excluded when sending. Users in these segments will not receive a notification, even if they were included in included_segments.
   * NB: This targeting parameter is only compatible with included_segments.
   * Example: ["Active Users", "Inactive Users"]
   */
  excluded_segments?: Array<string>;

  //with filters
  filters?: Array<Record<string, unknown>>;

  /**
   * Specific playerids to send your notification to. _Does not require API Auth Key.
   * Do not combine with other targeting parameters. Not compatible with any other targeting parameters.
   * Example: ["1dd608f2-c6a1-11e3-851d-000c2940e62c"]
   * Limit of 2,000 entries per REST API call
   */
  include_player_ids?: Array<string>;

  /**
   * Target specific devices by custom user IDs assigned via API.
   * Not compatible with any other targeting parameters
   * Example: [“custom-id-assigned-by-api”]
   * REQUIRED: REST API Key Authentication
   * Limit of 2,000 entries per REST API call.
   * Note: If targeting push, email, or sms subscribers with same ids, use with channel_for_external_user_ids to indicate you are sending a push or email or sms.
   */
  include_external_user_ids?: Array<string>;

  /**
   * Recommended for Sending Emails - Target specific email addresses.
   * If an email does not correspond to an existing user, a new user will be created.
   * Example: nick@catfac.ts
   * Limit of 2,000 entries per REST API call
   */
  include_email_tokens?: Array<string>;

  /**
   * Recommended for Sending SMS - Target specific phone numbers. The phone number should be in the E.164 format. Phone number should be an existing subscriber on OneSignal. Refer our docs to learn how to add phone numbers to OneSignal.
   * Example phone number: +1999999999
   * Limit of 2,000 entries per REST API call
   */
  include_phone_numbers?: Array<string>;

  //Indicates whether to send to all devices registered under your app's Apple iOS platform.
  isIos?: boolean;

  //Indicates whether to send to all devices registered under your app's Google Android platform.
  isAndroid?: boolean;

  //Indicates whether to send to all devices registered under your app's Huawei Android platform.
  isHuawei?: boolean;

  /**
   * Indicates whether to send to all subscribed web browser users, including Chrome, Firefox, and Safari.
   * You may use this instead as a combined flag instead of separately enabling isChromeWeb, isFirefox, and isSafari, though the three options are equivalent to this one.
   */
  isAnyWeb?: boolean;

  //Indicates whether to send to all Google Chrome, Chrome on Android, and Mozilla Firefox users registered under your Chrome & Firefox web push platform.
  isChromeWeb?: boolean;

  //Indicates whether to send to all Mozilla Firefox desktop users registered under your Firefox web push platform.
  isFirefox?: boolean;

  //Does not support iOS Safari. Indicates whether to send to all Apple's Safari desktop users registered under your Safari web push platform
  isSafari?: boolean;

  //Indicates whether to send to all devices registered under your app's Windows platform.
  isWP_WNS?: boolean;

  //	Indicates whether to send to all devices registered under your app's Amazon Fire platform.
  isAdm?: boolean;

  /**
   * This flag is not used for web push Please see isChromeWeb for sending to web push users. This flag only applies to Google Chrome Apps & Extensions.
   * Indicates whether to send to all devices registered under your app's Google Chrome Apps & Extension platform.
   */
  isChrome?: boolean;

  /*
   * A custom map of data that is passed back to your app. Same as using Additional Data within the dashboard. Can use up to 2048 bytes of data.
   * Example: {"abc": 123, "foo": "bar", "event_performed": true, "amount": 12.1}
   */
  data?: object;

  /**
   * Same as url but only sent to app platforms.
   * Including iOS, Android, macOS, Windows, ChromeApps, etc.
   */
  app_url?: string;
}

export interface IOneSignalEmail {
  //The subject of the email.
  email_subject: string;

  /**
   * (HTML supported)
   * Required unless template_id is set.
   * The body of the email you wish to send. Typically, customers include their own HTML templates here. Must include [unsubscribe_url] in an <a> tag somewhere in the email.
   * Note: any malformed HTML content will be sent to users. Please double-check your HTML is valid.
   */
  email_body?: string;

  /**
   * The name the email is from. If not specified, will default to "from name" set in the OneSignal Dashboard Email Settings.
   */
  email_from_name?: string;

  //(valid email address)	The email address the email is from. If not specified, will default to "from email" set in the OneSignal Dashboard Email Settings.
  email_from_address?: string;
}

export interface IOneSignalSms {
  //Phone Number used to send SMS. Should be a registered Twilio phone number in E.164 format.
  sms_from: string;

  /**
   * Text content for the SMS
   */
  contents?: string;

  /**
   * URLs for the media files to be attached to the SMS content.
   * Limit: 10 media urls with a total max. size of 5MBs.
   */
  sms_media_urls?: string;
}
