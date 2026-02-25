function clamp(x, lo, hi) {
  return Math.max(lo, Math.min(hi, x));
}

export function initBot(c) {
  const isBuyer = c.role === "buyer";

  // Bot is opposite role
  const botIsSeller = isBuyer;

  // Bot reservation is slightly tougher than user's target
  const botReservation = botIsSeller
    ? Math.round(c.target * 1.1)
    : Math.round(c.target * 0.9);

  const spread = Math.abs(botReservation - c.target);

  const botAnchor = botIsSeller
    ? botReservation + Math.round(spread * 0.4)
    : botReservation - Math.round(spread * 0.4);

  return {
    botIsSeller,
    botReservation,
    botOffer: botAnchor,
    round: 0
  };
}

export function botRespond(bot, userOffer) {
  bot.round += 1;

  const acceptable = bot.botIsSeller
    ? userOffer >= bot.botReservation
    : userOffer <= bot.botReservation;

  if (acceptable) {
    return {
      type: "ACCEPT",
      offer: userOffer,
      message: "That works for us. We have a deal."
    };
  }

  // concession toward reservation
  const distance = bot.botIsSeller
    ? bot.botOffer - bot.botReservation
    : bot.botReservation - bot.botOffer;

  const concession = Math.max(1, Math.round(distance * 0.25));

  bot.botOffer = bot.botIsSeller
    ? bot.botOffer - concession
    : bot.botOffer + concession;

  return {
    type: "COUNTER",
    offer: bot.botOffer,
    message: "We can move slightly. Here's our counteroffer."
  };
}