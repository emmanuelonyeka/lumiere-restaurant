/**
 * ============================================================
 * LUMIÈRE — TEMPLATE CONFIGURATION
 * ============================================================
 * Edit the values below to configure the template for your
 * restaurant. All booking pages read from this single file.
 * ============================================================
 */
window.LUMIERE_CONFIG = {
    /**
     * Public URL where this site is deployed.
     * Used in emails sent to guests so they can return to the site.
     * No trailing slash.
     * Example: 'https://www.your-restaurant.com'
     */
    baseUrl: 'https://YOUR-DOMAIN-HERE.com',

    /**
     * WhatsApp contact number in international format,
     * digits only, no '+' or spaces.
     * Example: '33123456789' for +33 1 23 45 67 89
     */
    whatsappNumber: '0000000000',

    /**
     * EmailJS configuration.
     * Sign up at https://www.emailjs.com to get your own credentials.
     *
     *   publicKey     — Your EmailJS public key (Account → API Keys)
     *   serviceId     — Your email service ID (Email Services tab)
     *   guestTemplate — Template ID used for emails sent to guests
     *   staffTemplate — Template ID used for emails sent to staff
     *
     * Email templates must include all the merge fields the booking
     * pages send. See README for the full field list.
     */
    emailjs: {
        publicKey:     'YOUR_EMAILJS_PUBLIC_KEY',
        serviceId:     'YOUR_EMAILJS_SERVICE_ID',
        guestTemplate: 'YOUR_GUEST_TEMPLATE_ID',
        staffTemplate: 'YOUR_STAFF_TEMPLATE_ID'
    },

    /**
     * Opening hours. The booking system uses this as the single source
     * of truth — time slots, closed-day blocking on the date picker,
     * and the displayed schedule on the homepage all derive from here.
     *
     * Each day is either:
     *   { closed: true }
     * or:
     *   { closed: false, services: [ { start, end }, ... ] }
     *
     * Times are 24-hour 'HH:MM' format. Each service can have its own
     * window — a day with both lunch and dinner has two services.
     *
     * Slots are generated every 30 minutes from service.start to
     * (service.end - buffer). The buffer is the minimum time before
     * close that the last reservation can be seated. Services lasting
     * at least 4 hours use the 'long' buffer; shorter services use
     * the 'short' buffer.
     */
    openingHours: {
        sunday:    { closed: false, services: [{ start: '12:00', end: '15:00' }, { start: '18:00', end: '21:00' }] },
        monday:    { closed: true },
        tuesday:   { closed: false, services: [{ start: '17:00', end: '22:00' }] },
        wednesday: { closed: false, services: [{ start: '17:00', end: '22:00' }] },
        thursday:  { closed: false, services: [{ start: '17:00', end: '22:00' }] },
        friday:    { closed: false, services: [{ start: '17:00', end: '23:00' }] },
        saturday:  { closed: false, services: [{ start: '17:00', end: '23:00' }] }
    },

    /**
     * Last-seat buffer, in minutes. The booking system stops accepting
     * reservations this long before the kitchen closes, so the kitchen
     * has time to prepare and serve.
     *
     *   long  — used for services of 4+ hours (typical weekday/weekend dinner)
     *   short — used for services under 4 hours (e.g. Sunday lunch or dinner)
     */
    lastSeatBuffer: {
        long: 90,
        short: 60
    }
};