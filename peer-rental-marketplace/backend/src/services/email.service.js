const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"PeerRent" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

const sendBookingCreatedEmail = async ({
  email,
  customerName,
  itemTitle,
  startDate,
  endDate,
  totalPrice,
}) => {
  await sendEmail({
    to: email,
    subject: "Booking Request Received - PeerRent",
    html: `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
        <h2 style="color:#2563eb;">PeerRent</h2>

        <p>Hi <strong>${customerName}</strong>,</p>

        <p>Your booking request has been received successfully.</p>

        <table style="border-collapse:collapse;width:100%;">
          <tr>
            <td><strong>Item</strong></td>
            <td>${itemTitle}</td>
          </tr>
          <tr>
            <td><strong>Start Date</strong></td>
            <td>${new Date(startDate).toLocaleDateString()}</td>
          </tr>
          <tr>
            <td><strong>End Date</strong></td>
            <td>${new Date(endDate).toLocaleDateString()}</td>
          </tr>
          <tr>
            <td><strong>Total Price</strong></td>
            <td>₹${totalPrice}</td>
          </tr>
        </table>

        <br>

        <p>Status: <strong>Pending</strong></p>

        <p>We'll notify you once the owner responds.</p>

        <hr>

        <p style="font-size:12px;color:#777;">
          Thanks for using PeerRent.
        </p>
      </div>
    `,
  });
};

const sendOwnerBookingNotificationEmail = async ({
  email,
  ownerName,
  renterName,
  itemTitle,
  startDate,
  endDate,
  totalPrice,
}) => {
  await sendEmail({
    to: email,
    subject: "New Booking Request - PeerRent",
    html: `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
        <h2 style="color:#2563eb;">PeerRent</h2>

        <p>Hi <strong>${ownerName}</strong>,</p>

        <p>You have received a new booking request for your item.</p>

        <table style="border-collapse:collapse;width:100%;">
          <tr>
            <td><strong>Item</strong></td>
            <td>${itemTitle}</td>
          </tr>
          <tr>
            <td><strong>Renter</strong></td>
            <td>${renterName}</td>
          </tr>
          <tr>
            <td><strong>Start Date</strong></td>
            <td>${new Date(startDate).toLocaleDateString()}</td>
          </tr>
          <tr>
            <td><strong>End Date</strong></td>
            <td>${new Date(endDate).toLocaleDateString()}</td>
          </tr>
          <tr>
            <td><strong>Total Price</strong></td>
            <td>₹${totalPrice}</td>
          </tr>
        </table>

        <br>

        <p>Please log in to PeerRent to review and respond to this booking request.</p>

        <hr>

        <p style="font-size:12px;color:#777;">
          PeerRent Team
        </p>
      </div>
    `,
  });
};
const sendBookingStatusEmail = async ({
  email,
  customerName,
  itemTitle,
  status,
}) => {
  const statusMap = {
    CONFIRMED: {
      subject: "Booking Confirmed - PeerRent",
      message:
        "Great news! Your booking has been confirmed by the owner.",
    },

    CANCELLED: {
      subject: "Booking Cancelled - PeerRent",
      message:
        "Your booking has been cancelled.",
    },

    COMPLETED: {
      subject: "Booking Completed - PeerRent",
      message:
        "Your booking has been marked as completed. Thanks for using PeerRent!",
    },

    ACTIVE: {
      subject: "Booking Started - PeerRent",
      message:
        "Your rental period has started. Enjoy your rental!",
    },
  };

  const emailContent = statusMap[status];

  if (!emailContent) return;

  await sendEmail({
    to: email,
    subject: emailContent.subject,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
        <h2 style="color:#2563eb;">PeerRent</h2>

        <p>Hello <strong>${customerName}</strong>,</p>

        <p>${emailContent.message}</p>

        <table style="border-collapse:collapse;width:100%;">
          <tr>
            <td><strong>Item</strong></td>
            <td>${itemTitle}</td>
          </tr>

          <tr>
            <td><strong>Status</strong></td>
            <td>${status}</td>
          </tr>
        </table>

        <br>

        <p>Thank you for choosing PeerRent.</p>

      </div>
    `,
  });
};

const sendPasswordResetEmail = async ({
  email,
  name,
  resetUrl,
}) => {
  await sendEmail({
    to: email,
    subject: "Reset Your PeerRent Password",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
        <h2 style="color:#2563eb;">PeerRent</h2>

        <p>Hello <strong>${name}</strong>,</p>

        <p>We received a request to reset your password.</p>

        <p>
          Click the button below to create a new password:
        </p>

        <p style="margin:30px 0;">
          <a
            href="${resetUrl}"
            style="
              background:#2563eb;
              color:white;
              padding:12px 24px;
              text-decoration:none;
              border-radius:6px;
            "
          >
            Reset Password
          </a>
        </p>

        <p>
          This link will expire in <strong>15 minutes</strong>.
        </p>

        <p>
          If you didn't request this password reset, you can safely ignore this email.
        </p>

        <hr>

        <small>
          PeerRent Team
        </small>
      </div>
    `,
  });
};

module.exports = {
  sendEmail,
  sendBookingCreatedEmail,
  sendOwnerBookingNotificationEmail,
  sendBookingStatusEmail,
  sendPasswordResetEmail,
};