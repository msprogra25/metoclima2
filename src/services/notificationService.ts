import { WeatherAlert } from '../types/weather';

class NotificationService {
  private audioCtx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Play synthetic acoustic alert sound via Web Audio API
  public playAlertSound(type: 'critical' | 'severe' | 'standard' = 'severe') {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'critical') {
        // High urgency alternating tone
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(660, now + 0.15);
        osc.frequency.setValueAtTime(880, now + 0.30);
        osc.frequency.setValueAtTime(660, now + 0.45);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
        gain.gain.setValueAtTime(0.3, now + 0.55);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

        osc.start(now);
        osc.stop(now + 0.75);
      } else {
        // Calmer informative alert chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880, now + 0.15); // A5

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc.start(now);
        osc.stop(now + 0.6);
      }
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  // Request browser push notification permission
  public async requestPermission(): Promise<NotificationPermission> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch {
      return 'denied';
    }
  }

  public getPermissionStatus(): NotificationPermission {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  }

  // Send native push notification (with fallback event for in-app alert)
  public sendPushNotification(alert: WeatherAlert, userLocationName: string): boolean {
    if (typeof window === 'undefined') return false;

    // Trigger local audio sound
    this.playAlertSound(alert.severity === 'critical' ? 'critical' : 'severe');

    // Trigger vibration if supported on mobile
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([200, 100, 200]);
      } catch {
        // Ignore vibration errors
      }
    }

    const title = `⚠️ ${alert.title}`;
    const body = `${alert.headline} (${userLocationName}). ${alert.description.slice(0, 110)}...`;

    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        const notif = new Notification(title, {
          body,
          tag: alert.id,
          badge: '/favicon.ico',
          icon: '/favicon.ico',
        });
        notif.onclick = () => {
          window.focus();
        };
        return true;
      } catch {
        // Fallback to in-app toast
      }
    }

    return false;
  }
}

export const notificationService = new NotificationService();
