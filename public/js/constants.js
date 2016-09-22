
/* CONSTANT VALUES */

/* exported spanishText frenchText englishExpressiveText spanishSSML frenchSSML englishExpresiveSSML */

// Sample text values
var spanishText = "Consciente de su patrimonio espiritual y moral, la Unión está fundada sobre los valores indivisibles y universales de la dignidad humana, la libertad, la igualdad y la solidaridad, y se basa en los principios de la democracia y el Estado de Derecho. Al instituir la ciudadanía de la Unión y crear un espacio de libertad, seguridad y justicia, sitúa a la persona en el centro de su actuación.",
    frenchText = "Consciente de son patrimoine spirituel et moral, l'Union se fonde sur les valeurs indivisibles et universelles de dignité humaine, de liberté, d'égalité et de solidarité; elle repose sur le principe de la démocratie et le principe de l'État de droit. Elle place la personne au coeur de son action en instituant la citoyenneté de l'Union et en créant un espace de liberté, de sécurité et de justice.",
    englishExpressiveText = "I have been assigned to handle your order status request. I am sorry to inform you that the items you requested are back-ordered. We apologize for the inconvenience. We don't know when those items will become available. Maybe next week but we are not sure at this time. Because we want you to be a happy customer, management has decided to give you a 50% discount!",
    englishText = "Conscious of its spiritual and moral heritage, the Union is founded on the indivisible, universal values of human dignity, freedom, equality and solidarity; it is based on the principles of democracy and the rule of law. It places the individual at the heart of its activities, by establishing the citizenship of the Union and by creating an area of freedom, security and justice.",
    germanText = "In dem Bewusstsein ihres geistig-religiösen und sittlichen Erbes gründet sich die Union auf die unteilbaren und universellen Werte der Würde des Menschen, der Freiheit, der Gleichheit und der Solidarität. Sie beruht auf den Grundsätzen der Demokratie und der Rechtsstaatlichkeit. Sie stellt den Menschen in den Mittelpunkt ihres Handelns, indem sie die Unionsbürgerschaft und einen Raum der Freiheit, der Sicherheit und des Rechts begründet.",
    italianText = "Consapevole del suo patrimonio spirituale e morale, l'Unione si fonda sui valori indivisibili e universali della dignità umana, della libertà, dell'uguaglianza e della solidarietà; essa si basa sul principio della democrazia e sul principio dello Stato di diritto. Pone la persona al centro della sua azione istituendo la cittadinanza dell'Unione e creando uno spazio di libertà, sicurezza e giustizia.",
    japaneseText = "精神的、そして道徳的な遺産を意識的に受け継いで、人間の尊厳、自由、平等、連帯の不可分で普遍的な価値を大前提として連合は設立される。すなわち、連合は民主主義と法治の原則に立脚する。連合は市民権を確立し、自由と安全、正義が確保された地域を創造することによって、その組織活動の中心に個人を置く。",
    brazilianPortugueseText = "Consciente do seu patrimônio espiritual e moral, a União é fundamentada nos valores indivisíveis e universais da dignidade humana, liberdade, igualdade e solidariedade; é baseada nos princípios da democracia e estado de direito. Ela coloca o indivíduo no centro de suas ações, ao instituir a cidadania da União e ao criar um espaço de liberdade, segurança e justiça.";

// Sample text values with SSML
var spanishSSML = "<p><s>Consciente de su patrimonio espiritual y moral<break time=\"300ms\"/>, la Unión está fundada sobre los valores indivisibles y universales de la dignidad humana, <prosody rate=\"-15%\"> la libertad, la igualdad y la solidaridad, </prosody> y se basa en los principios de la democracia y el Estado de Derecho<break time=\"500ms\"/>.</s> <s><prosody rate=\"+20%\">Al instituir la ciudadanía de la Unión </prosody> y crear un espacio de libertad, seguridad y justicia, sitúa a la persona en el centro de su actuación.</s></p>",
    frenchSSML = "<p><s>Consciente de son patrimoine spirituel et moral<break time=\"300ms\"/>,  l'Union se fonde sur les valeurs indivisibles et universelles de dignité humaine,  <prosody rate=\"-15%\"> de  liberté, d'égalité et de solidarité; </prosody> elle repose sur le principe de la démocratie et le principe de l'État de droit <break time=\"500ms\"/>. Elle place la personne au coeur de son action en instituant la citoyenneté de l'Union et en créant un espace de liberté, de sécurité et de justice.</s></p>",
    englishExpresiveSSML = "<speak>I have been assigned to handle your order status request.<express-as type=\"Apology\"> I am sorry to inform you that the items you requested are back-ordered. We apologize for the inconvenience.</express-as><express-as type=\"Uncertainty\"> We don't know when those items will become available. Maybe next week but we are not sure at this time.</express-as><express-as type=\"GoodNews\">Because we want you to be a happy customer, management has decided to give you a 50% discount! </express-as></speak>",
    usEnglishSSML = "<p><s>Conscious of its spiritual and moral heritage <break time=\"300ms\"/>, the Union is founded on the indivisible, universal values of <prosody rate=\"-15%\">human dignity, freedom, equality and solidarity.</prosody> It is based on the principles of democracy and the rule of law <break time=\"500ms\"/>. </s> <s> It places the individual at the heart of its activities, <prosody rate=\"+15%\">by establishing the citizenship of the Union</prosody> and by creating an area of freedom, security and justice.</s></p>",
    ukEnglishSSML = "<p><s>Conscious of its spiritual and moral heritage <break time=\"300ms\"/>, the Union is founded on the indivisible, universal values of human dignity, <prosody rate=\"-15%\">freedom, equality and solidarity.</prosody> It is based on the principles of democracy and the rule of law <break time=\"500ms\"/>. </s> <s> It places the individual at the heart of its activities, <prosody rate=\"+15%\">by establishing the citizenship of the Union</prosody> and by creating an area of freedom, security and justice.</s></p>",
    germanSSML = "<p><s>In dem Bewusstsein ihres geistig-religiösen und sittlichen <phoneme alphabet=\"ibm\" ph=\".1R.0bIs\">Erbes</phoneme> <break time=\"300ms\"/> gründet sich die Union auf die <prosody rate=\"-15%\">unteilbaren und universellen  Werte der Würde des Menschen, der Freiheit, der Gleichheit und der Solidarität.</prosody> Sie beruht auf den Grundsätzen der Demokratie und der Rechtsstaatlichkeit<break time=\"1s\"/>. Sie stellt den Menschen in den Mittelpunkt ihres <phoneme alphabet=\"ibm\" ph=\".1hAn.0d@lns\"> Handelns</phoneme>, <prosody rate=\"+10%\">indem sie die Unionsbürgerschaft und einen Raum der Freiheit, der Sicherheit und des Rechts begründet.</prosody></s></p>",
    italianSSML = "<p><s>Consapevole del suo patrimonio spirituale e morale<break time=\"300ms\"/>, l'Unione si fonda sui valori indivisibili e universali della dignità umana, <prosody rate=\"-15%\">della libertà, dell'uguaglianza e della solidarietà; </prosody> essa si basa sul principio della democrazia e sul principio dello Stato di diritto<break time=\"500ms\"/>.</s><s> Pone la persona al centro della sua azione istituendo la cittadinanza dell'Unione e creando uno spazio di libertà, sicurezza e giustizia.</s></p>",
    japaneseSSML = "<p><s>精神的、そして道徳的な遺産を<break time=\"300ms\"/>意識的に受け継いで、<prosody rate=\"-15%\">人間の尊厳、自由、平等、連帯の不可分で普遍的な価値を大前提として</prosody>連合は設立される。すなわち、連合は民主主義と法治の原則に立脚する。<break time=\"500ms\"/>連合は市民権を確立し、自由と安全、正義が確保された地域を創造することによって、その組織活動の中心に個人を置く。</s></p>",
    brazilianPortugueseSSML = "<p><s>Consciente do seu patrimônio espiritual e moral<break time=\"300ms\"/>, a União é fundamentada nos valores indivisíveis e universais da dignidade humana, <prosody rate=\"-15%\">liberdade, igualdade e solidariedade; </prosody> é baseada nos princípios da democracia e estado de direito<break time=\"500ms\"/>. </s> <s> <prosody rate=\"+15%\">Ela coloca o indivíduo no centro de suas ações, </prosody> ao instituir a cidadania da União e ao criar um espaço de liberdade, segurança e justiça.</s></p>";

// Sample text values with Voice Transformation SSML
var voiceTransformationUnsupported = "Voice Transformation not currently supported for this language"
var spanishVoiceTransformationSSML = voiceTransformationUnsupported,
    frenchVoiceTransformationSSML = voiceTransformationUnsupported,
    usEnglishVoiceTransformationSSML = "Hello! I'm Allison but you can change my voice however you wish. <voice-transformation type=\"Custom\" glottal_tension=\"-80%\"> For example, you can make my voice a bit softer, </voice-transformation> <voice-transformation type=\"Custom\" glottal_tension=\"40%\" breathiness=\"40%\"> or a bit strained. </voice-transformation><voice-transformation type=\"Custom\" timbre=\"Breeze\" timbre_extent=\"60%\"> You can alter my voice timbre making me sound like this person, </voice-transformation> <voice-transformation type=\"Custom\" timbre=\"Sunrise\"> or like another person in your different applications. </voice-transformation><voice-transformation type=\"Custom\" breathiness=\"90%\"> You can make my voice more breathy than it is normally. </voice-transformation><voice-transformation type=\"Young\" strength=\"80%\"> I can speak like a young girl. </voice-transformation><voice-transformation type=\"Custom\" pitch=\"-30%\" pitch_range=\"80%\" rate=\"60%\" glottal_tension=\"-80%\" timbre=\"Sunrise\"> And you can combine all this with modifications of my speech rate and my tone. </voice-transformation>",
    ukEnglishVoiceTransformationSSML = voiceTransformationUnsupported,
    germanVoiceTransformationSSML = voiceTransformationUnsupported,
    italianVoiceTransformationSSML = voiceTransformationUnsupported,
    japaneseVoiceTransformationSSML = voiceTransformationUnsupported,
    brazilianPortugueseVoiceTransformationSSML = voiceTransformationUnsupported;

window.SPEECH_SYNTHESIS_VOICES = {
    voices: [
    {
        "name": "en-US_AllisonVoice",
        "language": "en-US",
        "customizable": true,
        "gender": "female, expressive, transformable",
        "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/en-US_AllisonVoice",
        "description": "Allison: American English female voice."
    },
    {
        "name": "en-US_MichaelVoice",
        "language": "en-US",
        "customizable": true,
        "gender": "male",
        "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/en-US_MichaelVoice",
        "description": "Michael: American English male voice."
    },
    {
        "name": "en-US_LisaVoice",
        "language": "en-US",
        "customizable": true,
        "gender": "female",
        "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/en-US_LisaVoice",
        "description": "Lisa: American English female voice."
    },
    {
        "name": "en-GB_KateVoice",
        "language": "en-GB",
        "customizable": false,
        "gender": "female",
        "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/en-GB_KateVoice",
        "description": "Kate: British English female voice."
    },
    {
        "name": "fr-FR_ReneeVoice",
        "language": "fr-FR",
        "customizable": false,
        "gender": "female",
        "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/fr-FR_ReneeVoice",
        "description": "Renee: French (français) female voice."
    },
    {
        "name": "de-DE_BirgitVoice",
        "language": "de-DE",
        "customizable": false,
        "gender": "female",
        "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/de-DE_BirgitVoice",
        "description": "Birgit: Standard German of Germany (Standarddeutsch) female voice."
    },
    {
        "name": "de-DE_DieterVoice",
        "language": "de-DE",
        "customizable": false,
        "gender": "male",
        "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/de-DE_DieterVoice",
        "description": "Dieter: Standard German of Germany (Standarddeutsch) male voice."
    },
    {
        "name": "it-IT_FrancescaVoice",
        "language": "it-IT",
        "customizable": false,
        "gender": "female",
        "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/it-IT_FrancescaVoice",
        "description": "Francesca: Italian (italiano) female voice."
    },
    {
        "name": "ja-JP_EmiVoice",
        "language": "ja-JP",
        "customizable": false,
        "gender": "female",
        "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/ja-JP_EmiVoice",
        "description": "Emi: Japanese (日本語) female voice."
    },
    {
        "name": "pt-BR_IsabelaVoice",
        "language": "pt-BR",
        "customizable": false,
        "gender": "female",
        "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/pt-BR_IsabelaVoice",
        "description": "Isabela: Brazilian Portuguese (português brasileiro) female voice."
    },
    {
        "name": "es-ES_EnriqueVoice",
        "language": "es-ES",
        "customizable": false,
        "gender": "male",
        "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/es-ES_EnriqueVoice",
        "description": "Enrique: Castilian Spanish (español castellano) male voice."
    },
    {
        "name": "es-ES_LauraVoice",
        "language": "es-ES",
        "customizable": false,
        "gender": "female",
        "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/es-ES_LauraVoice",
        "description": "Laura: Castilian Spanish (español castellano) female voice."
    },
    {
        "name": "es-US_SofiaVoice",
        "language": "es-US",
        "customizable": false,
        "gender": "female",
        "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/es-US_SofiaVoice",
        "description": "Sofia: North American Spanish (español norteamericano) female voice."
    }
  ]
}
