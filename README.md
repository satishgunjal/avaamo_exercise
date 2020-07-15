# Problem Statement
* Find the total numbers of words in the [document](http://norvig.com/big.txt)
* List down top ten words (more tha 4 characters) with total count
* Using Yandex API find the synonyms and pos for top ten words
* Creat JSON object which include array of top ten words with list of synonyms and pos values

## API Details 
* API: https://dictionary.yandex.net/api/v1/dicservice.json/lookup
* Documentation: https://tech.yandex.com/dictionary/doc/dg/reference/lookup-docpage/
* API Key : dict.1.1.20170610T055246Z.0f11bdc42e7b693a.eefbde961e10106a4efa7d852287caa49ecc68c

# Solution
## Step 1: Read file in a non-blocking, asynchronous way
Read file from current directory and callback function is used access the content of file. Inside the callback function I am calling all other functions to get the final output

## Step 2: Split text to get array of words
Using split() method we can split text into an array based on a regular expression. The split method returns an array containing the separated words.

## Step 3: Count the frequency of each word
Using JavaScript object as a map for counting the number of times each word occurs in the file. The forEach() method is used to iterate over an array and then perform an operation on each word in the array. We are only including the words whose length is more than 4 characters. Then we check if the word exists in the map and if it does we increament its count. If the word doesn’t exist, then we add it to the map and give it an initial value of 1. The words are used as the object keys and the hasOwnProperty() method is used to check if the word exists as a key.

## Step 4: Sort by count in descending order
The wordsMap object can tell us the count of each word but it cannot be used to maintain order because it is not possible to sort objects. Instead, we can use an array to store the words sorted in order by count. Using the map() method we can iterate over our words array and transform each item into a manageable object and then store it in a new array. Finally using the array sort() method we can sort the items in descending order.

## Step 5: Calling REST API lookup method
Searches for a word or phrase in the Yandex dictionary and returns an automatically generated dictionary entry.

## Step 6: Process the response from lookup method
Process the response to get the synonyms and pos values.
**Note:** Since I am using lang 'en-en' API returns all the possible meanings of the input word. Each meaning of word has 'pos' and the list of synonyms. Also each synonym also has 'pos' In this step I will list synonyms and corresponding pos only

## Step 7: Create word list JSON object
Create final JSON object as per the requirement

# Final Result
```
Total word count=  1095695

Top ten words(more than 4 chars) with count
{ name: 'which', total: 4597 },
{ name: 'their', total: 2878 },
{ name: 'would', total: 1901 },
{ name: 'there', total: 1836 },
{ name: 'could', total: 1663 },
{ name: 'Prince', total: 1501 },
{ name: 'about', total: 1346 },
{ name: 'other', total: 1298 },
{ name: 'Pierre', total: 1260 },
{ name: 'should', total: 1257 }
  
lookup()> word =  which
lookup()> word =  their
lookup()> word =  would
lookup()> word =  there
lookup()> word =  could
lookup()> word =  Prince
lookup()> word =  about
lookup()> word =  other
lookup()> word =  Pierre
lookup()> word =  should

wordsList()> wordList=  {"word":[{"text":"which","count":4597,"synonyms":["whereby","what","whatever","some"],"pos":["conjunction","determiner / pronoun","determiner / pronoun","determiner / pronoun"]},{"text":"their","count":2878,"synonyms":["its"],"pos":["determiner / pronoun"]},{"text":"would","count":1901,"synonyms":[],"pos":[]},{"text":"there","count":1836,"synonyms":["out here","over here","exist"],"pos":["adverb","adverb","verb"]},{"text":"could","count":1663,"synonyms":["might","can","possible","able"],"pos":["noun","noun","adjective","adjective"]},{"text":"Prince","count":1501,"synonyms":["sovereign","ruler","king","lord","captain","your majesty","mogul","tsarevich"],"pos":["noun","noun","noun","noun","noun","noun","noun","noun"]},{"text":"about","count":1346,"synonyms":["next to","nigh","roughly","near","over","in relation to","virtually","almost","practically","somewhere","say","most"],"pos":["adverb","adverb","adverb","preposition","preposition","adverb","adverb","adverb","adverb","adverb","verb","determiner / pronoun"]},{"text":"other","count":1298,"synonyms":["else","differently","once","different","distinct","additional","farther","fresh","old"],"pos":["adverb","adverb","adverb","adjective","adjective","adjective","adverb","noun","noun"]},{"text":"Pierre","count":1260,"synonyms":[],"pos":[]},{"text":"should","count":1257,"synonyms":["must","necessary","ought","unless","shall"],"pos":["noun","noun","noun","conjunction","noun"]}]}
```
