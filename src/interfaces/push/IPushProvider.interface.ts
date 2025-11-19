export default interface IPushProvider {
  createNotification(notification: any);

  cancelNotification(identifier: any);
}
