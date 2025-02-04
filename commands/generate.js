const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('generate')
    .setDescription('Generate AI image from text')
    .addStringOption(option =>
      option.setName('prompt')
        .setDescription('Describe your image')
        .setRequired(true)),
  
  async execute(interaction, replicate) {
    await interaction.deferReply();
    
    try {
      const prompt = interaction.options.getString('prompt');
      
      // Correct input structure for SDXL
      const output = await replicate.run(
        "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
        { prompt: prompt } // Direct parameter passing
      );

      const imageResponse = await fetch(output[0]);
      const buffer = Buffer.from(await imageResponse.arrayBuffer());
      const attachment = new AttachmentBuilder(buffer, { name: 'generated-image.png' });

      await interaction.editReply({ 
        content: `Generated: "${prompt}"`,
        files: [attachment] 
      });
      
    } catch (error) {
      await interaction.editReply('Failed to generate image');
      console.error('Generation error:', error);
    }
  }
};