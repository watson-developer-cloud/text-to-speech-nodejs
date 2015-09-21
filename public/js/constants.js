
/* CONSTANT VALUES */

// Sample text values
var spanishText = "Consciente de su patrimonio espiritual y moral, la Unión está fundada sobre los valores indivisibles y universales de la dignidad humana, la libertad, la igualdad y la solidaridad, y se basa en los principios de la democracia y el Estado de Derecho. Al instituir la ciudadanía de la Unión y crear un espacio de libertad, seguridad y justicia, sitúa a la persona en el centro de su actuación.",
    frenchText = "Consciente de son patrimoine spirituel et moral, l'Union se fonde sur les valeurs indivisibles et universelles de dignité humaine, de liberté, d'égalité et de solidarité; elle repose sur le principe de la démocratie et le principe de l'État de droit. Elle place la personne au coeur de son action en instituant la citoyenneté de l'Union et en créant un espace de liberté, de sécurité et de justice.",
    englishText = "Conscious of its spiritual and moral heritage, the Union is founded on the indivisible, universal values of human dignity, freedom, equality and solidarity; it is based on the principles of democracy and the rule of law. It places the individual at the heart of its activities, by establishing the citizenship of the Union and by creating an area of freedom, security and justice.",
    germanText = "In dem Bewusstsein ihres geistig-religiösen und sittlichen Erbes gründet sich die Union auf die unteilbaren und universellen Werte der Würde des Menschen, der Freiheit, der Gleichheit und der Solidarität. Sie beruht auf den Grundsätzen der Demokratie und der Rechtsstaatlichkeit. Sie stellt den Menschen in den Mittelpunkt ihres Handelns, indem sie die Unionsbürgerschaft und einen Raum der Freiheit, der Sicherheit und des Rechts begründet.",
    italianText = "Consapevole del suo patrimonio spirituale e morale, l'Unione si fonda sui valori indivisibili e universali della dignità umana, della libertà, dell'uguaglianza e della solidarietà; essa si basa sul principio della democrazia e sul principio dello Stato di diritto. Pone la persona al centro della sua azione istituendo la cittadinanza dell'Unione e creando uno spazio di libertà, sicurezza e giustizia.";
    japaneseText = "精神的、そして道徳的な遺産を意識的に受け継いで、人間の尊厳、自由、平等、連帯の不可分で普遍的な価値を大前提として連合は設立される。すなわち、連合は民主主義と法治の原則に立脚する。連合は市民権を確立し、自由と安全、正義が確保された地域を創造することによって、その組織活動の中心に個人を置く。"

// Sample text values with SSML
var spanishSSML = "Spanish SSML is not presently supported",
    frenchSSML = "<p><s>Consciente de son patrimoine spirituel et moral<break time='1s'/>, l'Union se fonde sur les valeurs <prosody rate='slow'>indivisibles</prosody> et universelles de dignité humaine, de liberté, d'égalité et de solidarité <break time='2s'/> elle repose sur <prosody pitch='x-high'> le principe de la démocratie </prosody> et le principe de l'État de droit <break time='3s'/>. Elle place la personne au coeur de son action en instituant la citoyenneté de l'Union et en créant un espace de liberté, de sécurité et de justice.</s></p>",
    englishSSML = "<p><s>Conscious of its spiritual and moral heritage <break time='1s'/>, the Union is founded on the <prosody rate='slow'>indivisible</prosody>, universal values of human dignity, freedom, equality and solidarity <break time='2s'/> it is based on the <prosody pitch='x-high'>principles of democracy</prosody> and the rule of law <break time='3s'/>. </s> <s> It places the individual at the heart of its activities, by establishing the citizenship of the Union and by creating an area of freedom, security and justice. </s></p>",
    germanSSML = "<p><s>In dem Bewusstsein ihres geistig-religiösen und sittlichen Erbes gründet sich die Union auf die unteilbaren und universellen Werte der Würde des Menschen<break time='1s'/>, der Freiheit, der Gleichheit und der Solidarität<break time='3s'/>. Sie beruht auf den <prosody pitch='x-high'>Grundsätzen der Demokratie</prosody> und der Rechtsstaatlichkeit<break time='3s'/>. Sie stellt den Menschen in den Mittelpunkt ihres Handelns, indem sie die Unionsbürgerschaft und einen Raum der Freiheit, der Sicherheit und des Rechts begründet.</s></p>",
    italianSSML = "Italian SSML is not presently supported";
    japaneseSSML = "Japanese SSML is not presently supported";

window.SPEECH_SYNTHESIS_VOICES = {
    voices: [

    {
      "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/en-US_AllisonVoice", 
        "gender": "female", 
        "name": "en-US_AllisonVoice", 
        "language": "en-US", 
        "description": "English language with US dialect, female.  Higher-quality uncompressed Allison voice."
    }, 
    {
      "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/en-US_LisaVoice", 
      "gender": "female", 
      "name": "en-US_LisaVoice", 
      "language": "en-US", 
      "description": "English language with US dialect, female.  Higher-quality uncompressed Lisa voice."
    }, 
    {
      "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/en-US_MichaelVoice", 
      "gender": "male", 
      "name": "en-US_MichaelVoice", 
      "language": "en-US", 
      "description": "English language with US dialect, male voice.  The voice used by Watson Jeopardy system."
    }, 
    {
      "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/en-GB_KateVoice", 
      "gender": "female", 
      "name": "en-GB_KateVoice", 
      "language": "en-GB", 
      "description": "English language with UK dialect, female.  Higher-quality uncompressed Kate voice."
    },    
    {
      "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/fr-FR_ReneeVoice", 
      "gender": "female", 
      "name": "fr-FR_ReneeVoice", 
      "language": "fr-FR", 
      "description": "French language with French dialect, female.  Higher-quality uncompressed Renee voice."
    }, 
    {
      "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/de-DE_BirgitVoice", 
      "gender": "female", 
      "name": "de-DE_BirgitVoice", 
      "language": "de-DE", 
      "description": "German language with German dialect, female.  Higher-quality uncompressed Birgit voice."
    }, 
    {
      "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/de-DE_DieterVoice", 
      "gender": "male", 
      "name": "de-DE_DieterVoice", 
      "language": "de-DE", 
      "description": "German language with German dialect, male.  Higher-quality uncompressed Dieter voice."
    }, 
    {
      "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/it-IT_FrancescaVoice", 
      "gender": "female", 
      "name": "it-IT_FrancescaVoice", 
      "language": "it-IT", 
      "description": "Italian language with Italian dialect, female.  Higher-quality uncompressed Francesca voice."
    },
    {
      "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/ja-JP_EmiVoice", 
      "gender": "female", 
      "name": "ja-JP_EmiVoice", 
      "language": "ja-JP", 
      "description": "Japanese language, female.  Higher-quality uncompressed Emi voice."
    },    
    {
      "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/es-ES_EnriqueVoice", 
      "gender": "male", 
      "name": "es-ES_EnriqueVoice", 
      "language": "es-ES", 
      "description": "LLSS Spanish Male Language with Castilian dialect. Enrique talent"
    },
    {
      "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/es-ES_LauraVoice", 
      "gender": "female", 
      "name": "es-ES_LauraVoice", 
      "language": "es-ES", 
      "description": "LLSS Spanish female Language with Castilian dialect. Laura talent"
    }, 
    {
      "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/es-US_SofiaVoice", 
      "gender": "female", 
      "name": "es-US_SofiaVoice", 
      "language": "es-US", 
      "description": "Spanish language with US dialect, female.  Higher-quality uncompressed Sofia voice."
    }    
  ]
}
