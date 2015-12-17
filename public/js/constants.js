
/* CONSTANT VALUES */

// Sample text values
var spanishText = "Consciente de su patrimonio espiritual y moral, la Unión está fundada sobre los valores indivisibles y universales de la dignidad humana, la libertad, la igualdad y la solidaridad, y se basa en los principios de la democracia y el Estado de Derecho. Al instituir la ciudadanía de la Unión y crear un espacio de libertad, seguridad y justicia, sitúa a la persona en el centro de su actuación.",
    frenchText = "Consciente de son patrimoine spirituel et moral, l'Union se fonde sur les valeurs indivisibles et universelles de dignité humaine, de liberté, d'égalité et de solidarité; elle repose sur le principe de la démocratie et le principe de l'État de droit. Elle place la personne au coeur de son action en instituant la citoyenneté de l'Union et en créant un espace de liberté, de sécurité et de justice.",
    englishText = "Conscious of its spiritual and moral heritage, the Union is founded on the indivisible, universal values of human dignity, freedom, equality and solidarity; it is based on the principles of democracy and the rule of law. It places the individual at the heart of its activities, by establishing the citizenship of the Union and by creating an area of freedom, security and justice.",
    germanText = "In dem Bewusstsein ihres geistig-religiösen und sittlichen Erbes gründet sich die Union auf die unteilbaren und universellen Werte der Würde des Menschen, der Freiheit, der Gleichheit und der Solidarität. Sie beruht auf den Grundsätzen der Demokratie und der Rechtsstaatlichkeit. Sie stellt den Menschen in den Mittelpunkt ihres Handelns, indem sie die Unionsbürgerschaft und einen Raum der Freiheit, der Sicherheit und des Rechts begründet.",
    italianText = "Consapevole del suo patrimonio spirituale e morale, l'Unione si fonda sui valori indivisibili e universali della dignità umana, della libertà, dell'uguaglianza e della solidarietà; essa si basa sul principio della democrazia e sul principio dello Stato di diritto. Pone la persona al centro della sua azione istituendo la cittadinanza dell'Unione e creando uno spazio di libertà, sicurezza e giustizia.",
    japaneseText = "精神的、そして道徳的な遺産を意識的に受け継いで、人間の尊厳、自由、平等、連帯の不可分で普遍的な価値を大前提として連合は設立される。すなわち、連合は民主主義と法治の原則に立脚する。連合は市民権を確立し、自由と安全、正義が確保された地域を創造することによって、その組織活動の中心に個人を置く。",
    brazilianPortugueseText = "Consciente do seu patrimônio espiritual e moral, a União é fundamentada nos valores indivisíveis e universais da dignidade humana, liberdade, igualdade e solidariedade; é baseada nos princípios da democracia e estado de direito. Ela coloca o indivíduo no centro de suas ações, ao instituir a cidadania da União e ao criar um espaço de liberdade, segurança e justiça.";    

// Sample text values with SSML
var spanishSSML = "Spanish SSML is not presently supported",
    frenchSSML = "<p><s>Consciente de son patrimoine spirituel et moral<break time='1s'/>, l'Union se fonde sur les valeurs <prosody rate='slow'>indivisibles</prosody> et universelles de dignité humaine, de liberté, d'égalité et de solidarité <break time='2s'/> elle repose sur <prosody pitch='x-high'> le principe de la démocratie </prosody> et le principe de l'État de droit <break time='3s'/>. Elle place la personne au coeur de son action en instituant la citoyenneté de l'Union et en créant un espace de liberté, de sécurité et de justice.</s></p>",
    englishSSML = "<p><s>Conscious of its spiritual and moral heritage <break time='1s'/>, the Union is founded on the <prosody rate='slow'>indivisible</prosody>, universal values of human dignity, freedom, equality and solidarity <break time='2s'/> it is based on the <prosody pitch='x-high'>principles of democracy</prosody> and the rule of law <break time='3s'/>. </s> <s> It places the individual at the heart of its activities, by establishing the citizenship of the Union and by creating an area of freedom, security and justice. </s></p>",
    germanSSML = "<p><s>In dem Bewusstsein ihres geistig-religiösen und sittlichen Erbes gründet sich die Union auf die unteilbaren und universellen Werte der Würde des Menschen<break time='1s'/>, der Freiheit, der Gleichheit und der Solidarität<break time='3s'/>. Sie beruht auf den <prosody pitch='x-high'>Grundsätzen der Demokratie</prosody> und der Rechtsstaatlichkeit<break time='3s'/>. Sie stellt den Menschen in den Mittelpunkt ihres Handelns, indem sie die Unionsbürgerschaft und einen Raum der Freiheit, der Sicherheit und des Rechts begründet.</s></p>",
    italianSSML = "Italian SSML is not presently supported",
    japaneseSSML = "Japanese SSML is not presently supported",
    brazilianPortugueseSSML = "Brazilian Portuguese SSML is not presently supported";

window.SPEECH_SYNTHESIS_VOICES = {
    voices: [
    {
        "name": "en-US_AllisonVoice", 
        "language": "en-US", 
        "customizable": true, 
        "gender": "female", 
        "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/en-US_AllisonVoice", 
        "description": "Allison: American English female voice."
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
