import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Bell,
  CheckCircle2,
  Truck,
  Briefcase,
  IndianRupee,
  Clock,
  Check,
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    t,
    language,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    currentRole,
    setActivePage,
    setSelectedTrackingOrderId,
  } = useApp();

  if (!isOpen) return null;

  const filteredNotifs = notifications.filter(
    (n) => currentRole === 'guest' || n.targetRole === 'all' || n.targetRole === currentRole
  );

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'transport':
        return <Truck className="w-5 h-5 text-purple-600" />;
      case 'procurement':
        return <Briefcase className="w-5 h-5 text-blue-600" />;
      case 'payment':
        return <IndianRupee className="w-5 h-5 text-amber-600" />;
      default:
        return <Bell className="w-5 h-5 text-stone-600" />;
    }
  };

  const handleNotifClick = (notif: any) => {
    markNotificationRead(notif.id);
    if (notif.relatedId?.startsWith('ORD')) {
      setSelectedTrackingOrderId(notif.relatedId);
      setActivePage('tracking');
      onClose();
    } else if (notif.relatedId?.startsWith('LST')) {
      setActivePage('farmer_dashboard');
      onClose();
    } else if (notif.relatedId?.startsWith('TRP')) {
      setActivePage('transport');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Bell className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                {t.notificationCenterTitle}
              </h2>
              <p className="text-[11px] text-stone-500">
                {filteredNotifs.filter((n) => !n.read).length}{' '}
                {language === 'en' ? 'unread alerts' : 'படிக்காத அறிவிப்புகள்'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 p-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
              title={t.markAllAsRead}
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-stone-200 text-stone-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotifs.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-stone-700">{t.noNotifications}</h3>
            </div>
          ) : (
            filteredNotifs.map((notif) => {
              const displayTitle = language === 'ta' && notif.titleTa ? notif.titleTa : notif.title;
              const displayMessage = language === 'ta' && notif.messageTa ? notif.messageTa : notif.message;

              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotifClick(notif)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    !notif.read
                      ? 'bg-emerald-50/50 border-emerald-200 shadow-2xs'
                      : 'bg-white border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-stone-100 shrink-0 mt-0.5">
                    {getNotifIcon(notif.type)}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-stone-900">{displayTitle}</h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
                      )}
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {displayMessage}
                    </p>
                    <div className="flex items-center justify-between pt-1 text-[10px] text-stone-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {notif.timestamp}
                      </span>
                      {notif.relatedId && (
                        <span className="font-mono text-emerald-700 font-semibold">
                          #{notif.relatedId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 text-center">
          <p className="text-[11px] text-stone-500">
            {language === 'en'
              ? 'Real-time supply chain alerts for farmers, buyers, procurement & fleets.'
              : 'விவசாயிகள், வாங்குபவர்கள் மற்றும் வாகனங்களுக்கான நேரடி எச்சரிக்கைகள்.'}
          </p>
        </div>
      </div>
    </div>
  );
};
