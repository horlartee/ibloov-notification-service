export default interface IPushServiceProvider {
  sendPushNotification(notification: Record<string, unknown>);
}
