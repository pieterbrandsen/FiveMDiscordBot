const { ChildLogger } = require('leekslazylogger');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const { readdirSync } = require('fs');
const Canvas = require('canvas');

const log = new ChildLogger();
const eventObject = require('../modules/languageConfig').get('events', 'guildMemberAdd');

const { logText, text } = eventObject;

const applyText = (canvas, font, sentence, maxLength) => {
  let shorterSentence = sentence;
  const ctx = canvas.getContext('2d');
  ctx.font = font;

  if (ctx.measureText(shorterSentence).width <= maxLength) return shorterSentence;

  let removedText = '';
  const wordList = shorterSentence.split(' ').reverse();
  wordList.pop();
  for (let index = 0; index < wordList.length; index += 1) {
    const word = wordList[index];
    shorterSentence = shorterSentence.slice(0, -(word.length + 1));
    removedText = word.concat(` ${removedText}`);
    if (ctx.measureText(shorterSentence).width <= maxLength) {
      shorterSentence += `\n${removedText}`;
      return shorterSentence;
    }
  }
  shorterSentence += `\n${removedText}`;
  return shorterSentence;
};

module.exports = {
  name: 'guildMemberAdd',
  async execute(client, [member], { config }) {
    log.info(logText.userJoinedGuild.replace('{{ userTag }}', member.user.tag));
    if (member.user.bot || config.welcomingSystem.enabled.toLowerCase() !== 'true') return;

    const welcomeChannel = await client.channels.fetch(config.welcomingSystem.channelId);
    if (config.welcomingSystem.messageType.toLowerCase().includes('text')) {
      const message = new MessageEmbed().setTitle(text.userJoinedGuild.title.replace('{{ username }}', member.user.username).replace('{{ serverName }}', config.serverName)).setDescription(config.welcomingSystem.message).setColor(config.colour);
      await welcomeChannel.send(message);
    } else if (config.welcomingSystem.messageType.toLowerCase().includes('photo')) {
      const canvas = Canvas.createCanvas(960, 540);
      const ctx = canvas.getContext('2d');

      const fileLocation = "./user/images/welcomingSystem";
      const backgroundLocation = `${fileLocation}/backgrounds`; 
      const backgrounds = readdirSync(backgroundLocation).filter((file) => {return (file.endsWith('.png') || file.endsWith('.jpg'))});
      const background = await Canvas.loadImage(`${backgroundLocation}/${backgrounds[Math.floor(Math.random() * backgrounds.length)]}`);
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      const shapes = await Canvas.loadImage(`${fileLocation}/shapes.png`);
      ctx.drawImage(shapes, 0, 0);

      ctx.strokeStyle = '#74037b';
      ctx.strokeRect(0, 0, canvas.width, canvas.height);

      const maxLength = canvas.width * 0.45;
      const customText = text.customMessages[Math.floor(Math.random() * text.customMessages.length)].replace('{{ username }}', member.displayName);
      ctx.font = '38px open-sans';
      ctx.fillStyle = '#000';
      ctx.fillText(
        applyText(canvas, ctx.font, customText, maxLength),
        canvas.width * 0.42, canvas.height * 0.50, maxLength,
      );

      const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'png', size: 256, dynamic: true }));
      ctx.beginPath();
      ctx.arc(avatar.width / 2 + canvas.width * 0.12 + (256 - avatar.width) / 2, 
      canvas.height / 2, 128, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(avatar, canvas.width * 0.12 + (256 - avatar.width) / 2, 
      canvas.height / 2 - avatar.height / 2);

      const attachment = new MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
      await welcomeChannel.send(attachment);
    }
  },
};
