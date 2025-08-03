const { Events, EmbedBuilder } = require('discord.js');
const deepl = require('deepl-node');
const languageMap = require('../utils/languageMap.js');

module.exports = {
  name: Events.MessageReactionAdd,
  async execute(reaction, user) {
    if (user.bot || !languageMap[reaction.emoji.name]) return;
    if (reaction.message.partial) await reaction.message.fetch();

    const targetLang = languageMap[reaction.emoji.name];
    const originalMsg = reaction.message;
    const translator = new deepl.Translator(process.env.DEEPL_AUTH_KEY);

    const translatorResult = await translator.translateText(originalMsg.content, null, targetLang, {
      formality: 'prefer_less',
      modelType: 'prefer_quality_optimized',
      preserveFormatting: true,
      tagHandling: 'xml'
    });

    const footer = `${translatorResult.detectedSourceLang.toUpperCase()}  -->  ${targetLang}`;
    const description = translatorResult.text;
    const embed = new EmbedBuilder().setColor('#5865f2').setDescription(description).setFooter({ text: footer });

    const finalMsg = await originalMsg.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    setTimeout(() => finalMsg.delete(), 60 * 60000);
  },
};
