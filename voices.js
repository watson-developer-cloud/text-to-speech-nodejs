/* eslint max-len: off */
const ES_TEXT = 'Consciente de su patrimonio espiritual y moral, la Unión está fundada sobre los valores indivisibles y universales de la dignidad humana, la libertad, la igualdad y la solidaridad, y se basa en los principios de la democracia y el Estado de Derecho. Al instituir la ciudadanía de la Unión y crear un espacio de libertad, seguridad y justicia, sitúa a la persona en el centro de su actuación.';
const FR_TEXT = "Consciente de son patrimoine spirituel et moral, l'Union se fonde sur les valeurs indivisibles et universelles de dignité humaine, de liberté, d'égalité et de solidarité; elle repose sur le principe de la démocratie et le principe de l'État de droit. Elle place la personne au coeur de son action en instituant la citoyenneté de l'Union et en créant un espace de liberté, de sécurité et de justice.";
const US_TEXT = 'Conscious of its spiritual and moral heritage, the Union is founded on the indivisible, universal values of human dignity, freedom, equality and solidarity; it is based on the principles of democracy and the rule of law. It places the individual at the heart of its activities, by establishing the citizenship of the Union and by creating an area of freedom, security and justice.';
const DE_TEXT = 'In dem Bewusstsein ihres geistig-religiösen und sittlichen Erbes gründet sich die Union auf die unteilbaren und universellen Werte der Würde des Menschen, der Freiheit, der Gleichheit und der Solidarität. Sie beruht auf den Grundsätzen der Demokratie und der Rechtsstaatlichkeit. Sie stellt den Menschen in den Mittelpunkt ihres Handelns, indem sie die Unionsbürgerschaft und einen Raum der Freiheit, der Sicherheit und des Rechts begründet.';
const IT_TEXT = 'L\'Unione contribuisce alla salvaguardia e allo sviluppo di questi valori comuni nel rispetto della diversità delle culture e delle tradizioni dei popoli d\'Europa, nonché dell\'identità nazionale degli Stati membri e dell\'ordinamento dei loro pubblici poteri a livello nazionale, regionale e locale; essa si sforza di promuovere uno sviluppo equilibrato e sostenibile e assicura la libera circolazione delle persone, dei servizi, delle merci e dei capitali, nonché la libertà di stabilimento.';
const JP_TEXT = 'こちらでは配送手続きのご予約・変更を承っております。お客様の会員番号をお願いいたします。会員番号は、０１２３４５６７、ですね。確認いたしました。現在、３月２５日、ご自宅へ配送のご予約を頂いております。それでは、３月２５日、ご自宅へ配送の予定を、３月２６日のご配送に変更いたします。３月２６日は、降雪のため、配送が遅れることがあります。';
const PT_TEXT = 'Consciente do seu patrimônio espiritual e moral, a União é fundamentada nos valores indivisíveis e universais da dignidade humana, liberdade, igualdade e solidariedade; é baseada nos princípios da democracia e estado de direito. Ela coloca o indivíduo no centro de suas ações, ao instituir a cidadania da União e ao criar um espaço de liberdade, segurança e justiça.';
const AR_TEXT = 'تقوم خدمة I B M النص إلى خدمة الكلام بتحويل النص المكتوب إلى صوت طبيعي في مجموعة متنوعة من اللغات والأصوات.';
const CN_TEXT = '基于海量数据的云计算、大数据、人工智能、区块链等新兴技术，正在对商业产生深远的影响。科技变革的步伐持续加速，各行各业的领先企业正在将关键业务应用转移到云端，并积极利用 AI，重塑业务。';
const NL_TEXT = 'De volkeren van Europa hebben besloten een op gemeenschappelijke waarden gegrondveste vreedzame toekomst te delen door onderling een steeds hechter verbond tot stand te brengen. De Unie, die zich bewust is van haar geestelijke en morele erfgoed, heeft haar grondslag in de ondeelbare en universele waarden van menselijke waardigheid en van vrijheid, gelijkheid en solidariteit. Zij berust op het beginsel van democratie en het beginsel van de rechtsstaat. De Unie stelt de mens centraal in haar optreden, door het burgerschap van de Unie in te stellen en een ruimte van vrijheid, veiligheid en recht tot stand te brengen.';
const KO_TEXT = '11월 27일 일기예보입니다. 현재 전국이 대체로 맑으나 제주도와 경북동해안은 눈이 날리거나 빗방울이 떨어지는 곳이 있겠습니다. 오늘 낮 기온은 어제와 비슷하겠습니다. 내일 저녁 한때 서울, 경기도에는 비가 조금 오는 곳이 있겠으며, 충북북부와 경북남부에는 빗방울이 떨어지는 곳이 있겠습니다. 모레 밤부터 서해안을 중심으로 초속 60m 이상의 매우 강한 돌풍이 부는 곳이 있겠으니, 시설물 관리와 안전사고에 유의하시기 바랍니다. 지금까지 기상정보였습니다.';

// Sample text values with SSML
const ES_SSML = '<p><s>Consciente de su patrimonio espiritual y moral<break time="300ms"/>, la Unión está fundada sobre los valores indivisibles y universales de la dignidad humana, <prosody rate="-15%"> la libertad, la igualdad y la solidaridad, </prosody> y se basa en los principios de la democracia y el Estado de Derecho<break time="500ms"/>.</s> <s><prosody rate="+20%">Al instituir la ciudadanía de la Unión </prosody> y crear un espacio de libertad, seguridad y justicia, sitúa a la persona en el centro de su actuación.</s></p>';
const FR_SSML = '<p><s>Consciente de son patrimoine spirituel et moral<break time="300ms"/>,  l\'Union se fonde sur les valeurs indivisibles et universelles de dignité humaine,  <prosody rate="-15%"> de  liberté, d\'égalité et de solidarité; </prosody> elle repose sur le principe de la démocratie et le principe de l\'État de droit <break time="500ms"/>. Elle place la personne au coeur de son action en instituant la citoyenneté de l\'Union et en créant un espace de liberté, de sécurité et de justice.</s></p>';
const US_SSML = '<p><s>Conscious of its spiritual and moral heritage <break time="300ms"/>, the Union is founded on the indivisible, universal values of <prosody rate="-15%">human dignity, freedom, equality and solidarity.</prosody> It is based on the principles of democracy and the rule of law <break time="500ms"/>. </s> <s> It places the individual at the heart of its activities, <prosody rate="+15%">by establishing the citizenship of the Union</prosody> and by creating an area of freedom, security and justice.</s></p>';
const US_SSML_EXPRESSIVE = '<speak>I have been assigned to handle your order status request.<express-as type="Apology"> I am sorry to inform you that the items you requested are back-ordered. We apologize for the inconvenience.</express-as><express-as type="Uncertainty"> We don\'t know when those items will become available. Maybe next week but we are not sure at this time.</express-as><express-as type="GoodNews">Because we want you to be a happy customer, management has decided to give you a 50% discount! </express-as></speak>';
const US_GB_SSML = '<p><s>Conscious of its spiritual and moral heritage <break time="300ms"/>, the Union is founded on the indivisible, universal values of <prosody rate="-15%">human dignity, freedom, equality and solidarity.</prosody> It is based on the principles of democracy and the rule of law <break time="500ms"/>. </s> <s> It places the individual at the heart of its activities, <prosody rate="+15%">by establishing the citizenship of the Union</prosody> and by creating an area of freedom, security and justice.</s></p>';
const DE_SSML = '<p><s>In dem Bewusstsein ihres geistig-religiösen und sittlichen <phoneme alphabet="ibm" ph=".1R.0bIs">Erbes</phoneme> <break time="300ms"/> gründet sich die Union auf die <prosody rate="-15%">unteilbaren und universellen  Werte der Würde des Menschen, der Freiheit, der Gleichheit und der Solidarität.</prosody> Sie beruht auf den Grundsätzen der Demokratie und der Rechtsstaatlichkeit<break time="1s"/>. Sie stellt den Menschen in den Mittelpunkt ihres <phoneme alphabet="ibm" ph=".1hAn.0d@lns"> Handelns</phoneme>, <prosody rate="+10%">indem sie die Unionsbürgerschaft und einen Raum der Freiheit, der Sicherheit und des Rechts begründet.</prosody></s></p>';
const IT_SSML = '<p><s>Consapevole del suo patrimonio spirituale e morale<break time="300ms"/>, l\'Unione si fonda sui valori indivisibili e universali della dignità umana, <prosody rate="-15%">della libertà, dell\'uguaglianza e della solidarietà; </prosody> essa si basa sul principio della democrazia e sul principio dello Stato di diritto<break time="500ms"/>.</s><s> Pone la persona al centro della sua azione istituendo la cittadinanza dell\'Unione e creando uno spazio di libertà, sicurezza e giustizia.</s></p>';
const JP_SSML = '<p><s>こちらでは配送手続きのご予約・変更を承っております。お客様の会員番号をお願いいたします。<break time="1000ms"/>会員番号は、０１２３４５６７、ですね。確認いたしました。現在、３月２５日、ご自宅へ配送のご予約を頂いております。<break time="500ms"/>それでは、３月２５日、ご自宅へ配送の予定を、３月２６日のご配送に変更いたします。３月２６日は、降雪のため、配送が遅れることがあります。</s></p>';
const PT_SSML = '<p><s>Consciente do seu patrimônio espiritual e moral<break time="300ms"/>, a União é fundamentada nos valores indivisíveis e universais da dignidade humana, <prosody rate="-15%">liberdade, igualdade e solidariedade; </prosody> é baseada nos princípios da democracia e estado de direito<break time="500ms"/>. </s> <s> <prosody rate="+15%">Ela coloca o indivíduo no centro de suas ações, </prosody> ao instituir a cidadania da União e ao criar um espaço de liberdade, segurança e justiça.</s></p>';
const AR_SSML = 'تقوم خدمة <break time="100ms"/> I <break time="300ms"/> B <break time="300ms"/> M <break time="300ms"/> النص إلى خدمة الكلام بتحويل النص المكتوب إلى صوت طبيعي في مجموعة متنوعة من اللغات والأصوات.';
const CN_SSML = '基于海量数据的云计算、大数据、人工智能、区块链等新兴技术，正在对商业产生深远的影响。科技变革的步伐 <break time="100ms"/> 持续加速，各行各业的领先企业正在将关键业务应用 <break strength="strong"/> 转移到云端，并积极利用 AI，重塑业务。';
const NL_SSML = 'De volkeren van Europa hebben besloten een op gemeenschappelijke waarden gegrondveste vreedzame toekomst te delen <break time="100ms"/> door onderling een steeds hechter verbond tot stand te brengen. De Unie, die zich bewust is van haar geestelijke en morele erfgoed, heeft haar grondslag in de ondeelbare en universele waarden van <prosody rate="-8%">menselijke waardigheid en van vrijheid, gelijkheid en solidariteit. </prosody> Zij berust op het beginsel van democratie en het beginsel van de rechtsstaat. De Unie stelt de mens centraal in haar optreden <break time="100ms"/>, door het burgerschap van de Unie in te stellen en een ruimte van vrijheid, veiligheid en recht tot stand te brengen.';
const KO_SSML = '<p><prosody pitch="100Hz"><s><prosody rate="+15%">11월 27일 일기예보입니다.</prosody></s> <s>현재 전국이 대체로 <prosody rate="+15%">맑으나 제주도와</prosody> 경북동해안은 눈이 날리거나 빗방울이 떨어지는 곳이 있겠습니다.</s> <s>오늘 낮 기온은 어제와 비슷하겠습니다.</s> <s>내일 저녁 한때 서울, 경기도에는 비가 조금 오는 곳이 <prosody rate="+20%">있겠으며, 충북북부와</prosody> 경북남부에는 빗방울이 떨어지는 곳이 있겠습니다.</s> <s>모레 밤부터 서해안을 중심으로 초속 60m 이상의 매우 강한 돌풍이 부는 곳이 <prosody rate="+20%">있겠으니,<break strength="none"/> 시설물</prosody> 관리와 안전사고에 유의하시기 바랍니다.</s> <s><prosody rate="+15%" pitch="+5Hz">지금까지 기상정보였습니다.</prosody></s></prosody></p>';

// Sample text values with Voice Transformation SSML (Allison)
const US_VOICE_SSML_ALLISON = 'Hello! I\'m Allison, but you can change my voice however you wish. <voice-transformation type="Custom" glottal_tension="-80%"> For example, you can make my voice a bit softer, </voice-transformation> <voice-transformation type="Custom" glottal_tension="40%" breathiness="40%"> or a bit strained. </voice-transformation><voice-transformation type="Custom" timbre="Breeze" timbre_extent="60%"> '
  + 'You can alter my voice timbre making me sound like this person, </voice-transformation> <voice-transformation type="Custom" timbre="Sunrise"> or like another person in your different applications. </voice-transformation><voice-transformation type="Custom" breathiness="90%"> You can make my voice more breathy than it is normally. </voice-transformation><voice-transformation type="Young" strength="80%"> '
  + 'I can speak like a young girl. </voice-transformation><voice-transformation type="Custom" pitch="-30%" pitch_range="80%" rate="60%" glottal_tension="-80%" timbre="Sunrise"> And you can combine all this with modifications of my speech rate and my tone. </voice-transformation>';

// Sample text values with Voice Transformation SSML (Lisa)
const US_VOICE_SSML_LISA = 'Hello! I\'m Lisa, but you can change my voice however you wish. <voice-transformation type="Custom" glottal_tension="-80%"> For example, you can make my voice a bit softer, </voice-transformation> <voice-transformation type="Custom" glottal_tension="40%" breathiness="40%"> or a bit strained. </voice-transformation><voice-transformation type="Custom" timbre="Breeze" timbre_extent="60%"> You can alter my voice timbre making me sound like this person, </voice-transformation> <voice-transformation type="Custom" timbre="Sunrise"> or like another person in your different applications. </voice-transformation><voice-transformation type="Custom" breathiness="90%"> You can make my voice more breathy than it is normally. </voice-transformation><voice-transformation type="Young" strength="80%"> I can speak like a young girl. </voice-transformation><voice-transformation type="Custom" pitch="20%" pitch_range="80%" rate="60%" glottal_tension="-80%" timbre="Sunrise"> And you can combine all this with modifications of my speech rate and my tone. </voice-transformation>';
const US_VOICE_SSML_MICHAEL = 'Hello! I\'m Michael, but you can change my voice however you wish. <voice-transformation type="Custom" glottal_tension="-80%"> For example, you can make my voice a bit softer, </voice-transformation> <voice-transformation type="Custom" glottal_tension="40%" breathiness="40%"> or a bit strained. </voice-transformation><voice-transformation type="Custom" timbre="Breeze" timbre_extent="60%"> You can alter my voice timbre making me sound like this person, </voice-transformation> <voice-transformation type="Custom" timbre="Sunrise"> or like another person in your different applications. </voice-transformation><voice-transformation type="Custom" breathiness="90%"> You can make my voice more breathy than it is normally. </voice-transformation><voice-transformation type="Young" strength="80%"> I can speak like a young boy. </voice-transformation><voice-transformation type="Custom" pitch="20%" pitch_range="80%" rate="60%" glottal_tension="-80%" timbre="Sunrise"> And you can combine all this with modifications of my speech rate and my tone. </voice-transformation>';


const voices = [
  {
    name: 'pt-BR_IsabelaVoice',
    language: 'pt-BR',
    option: 'Brazilian Portuguese (pt-BR): Isabela (female)',
    customizable: true,
    gender: 'female',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/pt-BR_IsabelaVoice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: PT_TEXT,
      ssml: PT_SSML,
    },
    description: 'Isabela: Brazilian Portuguese (português brasileiro) female voice.',
  }, {
    name: 'pt-BR_IsabelaV3Voice',
    language: 'pt-BR',
    option: 'Brazilian Portuguese (pt-BR): IsabelaV3 (female, enhanced dnn)',
    customizable: true,
    gender: 'female',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/pt-BR_IsabelaV3Voice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: PT_TEXT,
      ssml: PT_SSML,
    },
    description: 'Isabela: Brazilian Portuguese (português brasileiro) female voice. Dnn technology.',
  }, {
    name: 'ja-JP_EmiVoice',
    language: 'ja-JP',
    option: 'Japanese (ja-JP): Emi (female)',
    customizable: true,
    gender: 'female',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/ja-JP_EmiVoice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: JP_TEXT,
      ssml: JP_SSML,
    },
    description: 'Emi: Japanese (日本語) female voice.',
  }, {
    name: 'ja-JP_EmiV3Voice',
    language: 'ja-JP',
    option: 'Japanese (ja-JP): EmiV3 (female, enhanced dnn)',
    customizable: true,
    gender: 'female',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/ja-JP_EmiV3Voice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: JP_TEXT,
      ssml: JP_SSML,
    },
    description: 'Emi: Japanese (日本語) female voice. Dnn technology.',
  }, {
    name: 'en-US_MichaelVoice',
    language: 'en-US',
    option: 'American English (en-US): Michael (male, transformable)',
    customizable: true,
    gender: 'male',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/en-US_MichaelVoice',
    supported_features: {
      voice_transformation: true,
      custom_pronunciation: true,
    },
    demo: {
      text: US_TEXT,
      ssml: US_SSML,
      ssml_voice: US_VOICE_SSML_MICHAEL,
    },
    description: 'Michael: American English male voice. Dnn technology.',
  }, {
    name: 'en-US_MichaelV3Voice',
    language: 'en-US',
    option: 'American English (en-US): MichaelV3 (male, enhanced dnn)',
    customizable: true,
    gender: 'male',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/en-US_MichaelV3Voice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: US_TEXT,
      ssml: US_SSML,
    },
    description: 'Michael: American English male voice. Dnn technology.',
  }, {
    name: 'en-US_AllisonVoice',
    option: 'American English (en-US): Allison (female, expressive, transformable)',
    language: 'en-US',
    customizable: true,
    gender: 'female',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/en-US_AllisonVoice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: US_TEXT,
      ssml: US_SSML_EXPRESSIVE,
      ssml_voice: US_VOICE_SSML_ALLISON,
    },
    description: 'Allison: American English female voice.',
  }, {
    name: 'en-US_AllisonV3Voice',
    option: 'American English (en-US): AllisonV3 (female, enhanced dnn)',
    language: 'en-US',
    customizable: true,
    gender: 'female',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/en-US_AllisonV3Voice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: US_TEXT,
      ssml: US_SSML,
    },
    description: 'Allison: American English female voice. Dnn technology.',
  }, {
    name: 'fr-FR_ReneeVoice',
    option: 'French (fr-FR): Renee (female)',
    language: 'fr-FR',
    customizable: true,
    gender: 'female',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/fr-FR_ReneeVoice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: FR_TEXT,
      ssml: FR_SSML,
    },
    description: 'Renee: French (français) female voice.',
  }, {
    name: 'fr-FR_ReneeV3Voice',
    option: 'French (fr-FR): ReneeV3 (female, enhanced dnn)',
    language: 'fr-FR',
    customizable: true,
    gender: 'female',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/fr-FR_ReneeV3Voice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: FR_TEXT,
      ssml: FR_SSML,
    },
    description: 'Renee: French (français) female voice. Dnn technology.',
  }, {
    name: 'fr-FR_NicolasV3Voice',
    option: 'French (fr-FR): NicolasV3 (male, enhanced dnn)',
    language: 'fr-FR',
    customizable: true,
    gender: 'female',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/fr-FR_NocolasV3Voice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: FR_TEXT,
      ssml: FR_SSML,
    },
    description: 'Renee: French (Nicolas) male voice. Dnn technology.',
  }, {
    name: 'it-IT_FrancescaVoice',
    language: 'it-IT',
    option: 'Italian (it-IT): Francesca (female)',
    customizable: true,
    gender: 'female',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/it-IT_FrancescaVoice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: IT_TEXT,
      ssml: IT_SSML,
    },
    description: 'Francesca: Italian (italiano) female voice.',
  }, {
    name: 'it-IT_FrancescaV3Voice',
    option: 'Italian (it-IT): FrancescaV3 (female, enhanced dnn)',
    language: 'it-IT',
    customizable: true,
    gender: 'female',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/it-IT_FrancescaV3Voice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: IT_TEXT,
      ssml: IT_SSML,
    },
    description: 'Francesca: Italian (italiano) female voice. Dnn technology.',
  }, {
    name: 'es-ES_LauraVoice',
    language: 'es-ES',
    option: 'Castilian Spanish (es-ES): Laura (female)',
    customizable: true,
    gender: 'female',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/es-ES_LauraVoice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: ES_TEXT,
      ssml: ES_SSML,
    },
    description: 'Laura: Castilian Spanish (español castellano) female voice.',
  }, {
    name: 'es-ES_LauraV3Voice',
    language: 'es-ES',
    option: 'Castilian Spanish (es-ES): LauraV3 (female, enhanced dnn)',
    customizable: true,
    gender: 'female',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/es-ES_LauraV3Voice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: ES_TEXT,
      ssml: ES_SSML,
    },
    description: 'Laura: Castilian Spanish (español castellano) female voice. Dnn technology.',
  }, {
    name: 'de-DE_BirgitVoice',
    language: 'de-DE',
    option: 'German (de-DE): Birgit (female)',
    customizable: true,
    gender: 'female',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/de-DE_BirgitVoice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: DE_TEXT,
      ssml: DE_SSML,
    },
    description: 'Birgit: Standard German of Germany (Standarddeutsch) female voice.',
  }, {
    name: 'de-DE_BirgitV3Voice',
    language: 'de-DE',
    option: 'German (de-DE): BirgitV3 (female, enhanced dnn)',
    customizable: true,
    gender: 'female',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/de-DE_BirgitV3Voice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: DE_TEXT,
      ssml: DE_SSML,
    },
    description: 'Birgit: Standard German of Germany (Standarddeutsch) female voice. Dnn technology.',
  }, {
    name: 'de-DE_ErikaV3Voice',
    language: 'de-DE',
    option: 'German (de-DE): ErikaV3 (female, enhanced dnn)',
    customizable: true,
    gender: 'female',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/de-DE_ErikaV3Voice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: DE_TEXT,
      ssml: DE_SSML,
    },
    description: 'Erika: Standard German of Germany (Standarddeutsch) female voice. Dnn technology.',
  }, {
    name: 'es-ES_EnriqueVoice',
    option: 'Castilian Spanish (es-ES): Enrique (male)',
    language: 'es-ES',
    customizable: true,
    gender: 'male',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/es-ES_EnriqueVoice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: ES_TEXT,
      ssml: ES_SSML,
    },
    description: 'Enrique: Castilian Spanish (español castellano) male voice.',
  }, {
    name: 'es-ES_EnriqueV3Voice',
    option: 'Castilian Spanish (es-ES): EnriqueV3 (male, enhanced dnn)',
    language: 'es-ES',
    customizable: true,
    gender: 'male',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/es-ES_EnriqueV3Voice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: ES_TEXT,
      ssml: ES_SSML,
    },
    description: 'Enrique: Castilian Spanish (español castellano) male voice. Dnn technology.',
  }, {
    name: 'de-DE_DieterVoice',
    language: 'de-DE',
    option: 'German (de-DE): Dieter (male)',
    customizable: true,
    gender: 'male',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/de-DE_DieterVoice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: DE_TEXT,
      ssml: DE_SSML,
    },
    description: 'Dieter: Standard German of Germany (Standarddeutsch) male voice.',
  }, {
    name: 'de-DE_DieterV3Voice',
    language: 'de-DE',
    option: 'German (de-DE): DieterV3 (male, enhanced dnn)',
    customizable: true,
    gender: 'male',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/de-DE_DieterV3Voice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: DE_TEXT,
      ssml: DE_SSML,
    },
    description: 'Dieter: Standard German of Germany (Standarddeutsch) male voice. Dnn technology.',
  }, {
    name: 'en-US_LisaVoice',
    option: 'American English (en-US): Lisa (female, transformable)',
    language: 'en-US',
    customizable: true,
    gender: 'female',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/en-US_LisaVoice',
    supported_features: {
      voice_transformation: true,
      custom_pronunciation: true,
    },
    demo: {
      text: US_TEXT,
      ssml: US_SSML,
      ssml_voice: US_VOICE_SSML_LISA,
    },
    description: 'Lisa: American English female voice.',
  }, {
    name: 'en-US_LisaV3Voice',
    option: 'American English (en-US): LisaV3 (female, enhanced dnn)',
    language: 'en-US',
    customizable: true,
    gender: 'female',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/en-US_LisaV3Voice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: US_TEXT,
      ssml: US_SSML,
    },
    description: 'Lisa: American English female voice. Dnn technology',
  }, {
    name: 'en-US_OliviaV3Voice',
    option: 'American English (en-US): OliviaV3 (female, enhanced dnn)',
    language: 'en-US',
    customizable: true,
    gender: 'female',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/en-US_OliviaV3Voice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: US_TEXT,
      ssml: US_SSML,
    },
    description: 'Olivia: American English female voice. Dnn technology',
  }, {
    name: 'en-US_HenryV3Voice',
    option: 'American English (en-US): HenryV3 (male, enhanced dnn)',
    language: 'en-US',
    customizable: true,
    gender: 'male',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/en-US_HenryV3Voice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: US_TEXT,
      ssml: US_SSML,
    },
    description: 'Henry: American English male voice. Dnn technology',
  }, {
    name: 'en-US_KevinV3Voice',
    option: 'American English (en-US): KevinV3 (male, enhanced dnn)',
    language: 'en-US',
    customizable: true,
    gender: 'male',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/en-US_KevinV3Voice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: US_TEXT,
      ssml: US_SSML,
    },
    description: 'Kevin: American English male voice. Dnn technology',
  }, {
    name: 'en-US_EmilyV3Voice',
    option: 'American English (en-US): EmilyV3 (female, enhanced dnn)',
    language: 'en-US',
    customizable: true,
    gender: 'female',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/en-US_EmilyV3Voice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: US_TEXT,
      ssml: US_SSML,
    },
    description: 'Emily: American English female voice. Dnn technology',
  }, {
    name: 'en-GB_KateVoice',
    option: 'British English (en-GB): Kate (female)',
    language: 'en-GB',
    customizable: true,
    gender: 'female',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/en-GB_KateVoice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: US_TEXT,
      ssml: US_GB_SSML,
    },
    description: 'Kate: British English female voice.',
  }, {
    name: 'en-GB_KateV3Voice',
    option: 'British English (en-GB): KateV3 (female, enhanced dnn)',
    language: 'en-GB',
    customizable: true,
    gender: 'female',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/en-GB_KateV3Voice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: US_TEXT,
      ssml: US_GB_SSML,
    },
    description: 'Kate: British English female voice. Dnn technology.',
  }, {
    name: 'es-US_SofiaVoice',
    language: 'es-US',
    option: 'North American Spanish (es-US): Sofia (female)',
    customizable: true,
    gender: 'female',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/es-US_SofiaVoice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: ES_TEXT,
      ssml: ES_SSML,
    },
    description: 'Sofia: North American Spanish (español norteamericano) female voice.',
  }, {
    name: 'es-US_SofiaV3Voice',
    language: 'es-US',
    option: 'North American Spanish (es-US): SofiaV3 (female, enhanced dnn)',
    customizable: true,
    gender: 'female',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/es-US_SofiaV3Voice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: ES_TEXT,
      ssml: ES_SSML,
    },
    description: 'Sofia: North American Spanish (español norteamericano) female voice. Dnn technology.',
  }, {
    name: 'en-GB_CharlotteV3Voice',
    option: 'British English (en-GB): CharlotteV3 (female, enhanced dnn)',
    language: 'en-GB',
    customizable: true,
    gender: 'female',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/en-GB_CharlotteV3Voice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: US_TEXT,
      ssml: US_GB_SSML,
    },
    description: 'Charlotte: British English female voice. Dnn technology.',
  }, {
    name: 'en-GB_JamesV3Voice',
    option: 'British English (en-GB): JamesV3 (male, enhanced dnn)',
    language: 'en-GB',
    customizable: true,
    gender: 'female',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/en-GB_JamesV3Voice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: US_TEXT,
      ssml: US_GB_SSML,
    },
    description: 'James: British English male voice. Dnn technology.',
  }, {
    name: 'es-LA_SofiaVoice',
    language: 'es-LA',
    option: 'Latin American Spanish (es-LA): Sofia (female)',
    customizable: true,
    gender: 'female',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/es-LA_SofiaVoice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: ES_TEXT,
      ssml: ES_SSML,
    },
    description: 'Sofia: Latin American Spanish (español latinoamericano) female voice.',
  }, {
    name: 'es-LA_SofiaV3Voice',
    language: 'es-LA',
    option: 'Latin American Spanish (es-LA): SofiaV3 (female, enhanced dnn)',
    customizable: true,
    gender: 'female',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/es-LA_SofiaV3Voice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: ES_TEXT,
      ssml: ES_SSML,
    },
    description: 'Sofia: Latin American Spanish (español latinoamericano) female voice. Dnn technology.',
  }, {
    name: 'ar-AR_OmarVoice',
    language: 'ar-AR',
    option: 'Arabic (ar-AR): Omar (male)',
    customizable: false,
    gender: 'male',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/ar-AR_OmarVoice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: false,
    },
    demo: {
      text: AR_TEXT,
      ssml: AR_SSML,
    },
    description: 'Omar: Arabic male voice. This language is in beta.',
  }, {
    name: 'zh-CN_LiNaVoice',
    language: 'zh-CN',
    option: 'Chinese, Mandarin (zh-CN): LiNa (female)',
    customizable: false,
    gender: 'female',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/zh-CN_LiNaVoice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: false,
    },
    demo: {
      text: CN_TEXT,
      ssml: CN_SSML,
    },
    description: 'LiNa: Mandarin Chinese voice (female). This language is in beta.',
  }, {
    name: 'zh-CN_WangWeiVoice',
    language: 'zh-CN',
    option: 'Chinese, Mandarin (zh-CN): WangWei (Male)',
    customizable: false,
    gender: 'male',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/zh-CN_WangWeiVoice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: false,
    },
    demo: {
      text: CN_TEXT,
      ssml: CN_SSML,
    },
    description: 'WangWei: Mandarin Chinese voice (male). This language is in beta.',
  }, {
    name: 'zh-CN_ZhangJingVoice',
    language: 'zh-CN',
    option: 'Chinese, Mandarin (zh-CN): ZhangJing (female)',
    customizable: false,
    gender: 'female',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/zh-CN_ZhangJingVoice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: false,
    },
    demo: {
      text: CN_TEXT,
      ssml: CN_SSML,
    },
    description: 'ZhangJing: Mandarin Chinese voice (female). This language is in beta.',
  }, {
    name: 'nl-NL_EmmaVoice',
    language: 'nl-NL',
    option: 'Dutch (nl-NL): Emma (female)',
    customizable: false,
    gender: 'female',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/nl-NL_EmmaVoice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: false,
    },
    demo: {
      text: NL_TEXT,
      ssml: NL_SSML,
    },
    description: 'Emma: Dutch voice (female). This language is in beta.',
  }, {
    name: 'nl-NL_LiamVoice',
    language: 'nl-NL',
    option: 'Dutch (nl-NL): Liam (male)',
    customizable: false,
    gender: 'male',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/nl-NL_LiamVoice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: false,
    },
    demo: {
      text: NL_TEXT,
      ssml: NL_SSML,
    },
    description: 'Liam: Dutch voice (male). This language is in beta.',
  }, {
    name: 'ko-KR_YoungmiVoice',
    language: 'ko-KR',
    option: 'Korean (ko-KR): Youngmi (female)',
    customizable: true,
    gender: 'female',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/ko-KR_YoungmiVoice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: KO_TEXT,
      ssml: KO_SSML,
    },
    description: 'Youngmi: Korean voice (female). This language is in beta.',
  }, {
    name: 'ko-KR_YunaVoice',
    language: 'ko-KR',
    option: 'Korean (ko-KR): Yuna (female)',
    customizable: true,
    gender: 'female',
    url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices/ko-KR_YunaVoice',
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true,
    },
    demo: {
      text: KO_TEXT,
      ssml: KO_SSML,
    },
    description: 'Yuna: Korean voice (female). This language is in beta.',
  },
];

const sortedByOption = (rhs, lhs) => {
  let result = -1;
  if (rhs.option === lhs.option) {
    result = 0;
  } else if (rhs.option > lhs.option) {
    result = 1;
  }
  return result;
};

const sortedvoices = voices.sort(sortedByOption);
module.exports = sortedvoices;
