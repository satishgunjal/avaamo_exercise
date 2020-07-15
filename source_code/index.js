/**
 * Note: Without any selection criteria top 10 words are as below, format is word(count),
  * [the(71744), of(39169), and(35968), to(27895), a(19811), in(19515), that(11216), was(11129), his(9561), he(9362)]
  * So I am counting words with more that 4 characters only.(Discussed with Jayanth and received confirmation for this change)
 */

'use strict';

// Load the fs class using the require command
var fs = require('fs');
//Load third party module 'request' for consuming REST API
var request = require('request'); 

const FILE = 'big.txt';
const API = "https://dictionary.yandex.net/api/v1/dicservice.json/lookup?";
const API_KEY = "dict.1.1.20170610T055246Z.0f11bdc42e7b693a.eefbde961e10106a4efa7d852287caa49ecc68cf";
const LANG = "en-en"; //To get all the possible meanings of the word in English

//This object will hold the top ten words(more than 4 chars), count, synonyms and pos values in JSON format
var wordList = {}
wordList['word'] = [];

/*************** Step_1: Read file in a non-blocking, asynchronous way ***************/

/**
 * Read file from current directory and callback function is used access the content of file
 * Inside the callback function I am calling all other functions to get the final output
 */
fs.readFile(FILE, 'utf8', async function (err, data) {
    if (err) throw err; 
    //Step_2: Split text to get array of words 
    let wordsArray = splitByWords(data);
    console.log('Total word count= ', wordsArray.length)

    //Step_3: Count the frequency of each word 
    let wordsMap = createWordMap(wordsArray);

    //Step_4: Sort by count in descending order
    let finalWordsArray = sortByCount(wordsMap);

    let top_ten_words = finalWordsArray.slice(0, 10);
    console.log('Top ten words(more than 4 chars) with count\n', top_ten_words);

    let word, wordCount, output
    for (let i in top_ten_words){
        word = top_ten_words[i].name;
        wordCount = top_ten_words[i].total;

        // Step_6: Process the response from lookup method
        output = await procesDicResults(word);

        // Step_7: Create word list JSON object
        wordsList(word, wordCount, output[0], output[1])
    }
    console.log('wordsList()> wordList= ', JSON.stringify(wordList))
});

/*************** Step_2: Split text to get array of words ***************/

/**
 * To split string by spaces (including spaces, tabs, and newlines)
 * Using split() method we can split text into an array based on a regular expression. 
 * The split method returns an array containing the separated words.
 * @param {*} text 
 */
function splitByWords (text) {
    var wordsArray = text.trim().split(/\s+/);
    return wordsArray;
}

/*************** Step_3: Count the frequency of each word ***************/

/**
  * Using JavaScript object as a map for counting the number of times each word occurs in the file. 
  * The forEach() method is used to iterate over an array and then perform an operation on each word in the array. 
  * We are only including the words whose length is more than 4 characters.
  * Then we check if the word exists in the map and if it does we increament its count.
  * If the word doesn’t exist, then we add it to the map and give it an initial value of 1. 
  * The words are used as the object keys and the hasOwnProperty() method is used to check if the word exists as a key.
  * @param {*} wordsArray 
  */
function createWordMap(wordsArray) {
    // create map for word counts
    var wordsMap = {};
    wordsArray.forEach(function (key) {
        if(key.length > 4){
            if (wordsMap.hasOwnProperty(key)) {
                wordsMap[key]++;
            } else {
                wordsMap[key] = 1;
            }
        }        
    });  
    return wordsMap;  
  }

/*************** Step_4: Sort by count in descending order ***************/
  
/**
 * The wordsMap object can tell us the count of each word but it cannot be used to maintain order because it is not 
 * possible to sort objects. Instead, we can use an array to store the words sorted in order by count. 
 * Using the map() method we can iterate over our words array and transform each item into a manageable object and 
 * then store it in a new array. Finally using the array sort() method we can sort the items in descending order.
 * @param {*} wordsMap 
 */
function sortByCount(wordsMap) {
    // sort by count in descending order
    var finalWordsArray = [];
    finalWordsArray = Object.keys(wordsMap).map(function (key) {
        return {
        name: key,
        total: wordsMap[key]
        };
    });
    finalWordsArray.sort(function (a, b) {
        return b.total - a.total; // b-a for descending order
    });
    return finalWordsArray;  
}

/*************** Step_5: Calling REST API lookup method ***************/

/**
 * Searches for a word or phrase in the Yandex dictionary and returns an automatically generated dictionary entry.
 * @param {*} word 
 */
function lookup(word){
    console.log('lookup()> word = ', word)
    let req_url = `${API}key=${API_KEY}&lang=${LANG}&text=${word}`  
    // Return new promise 
    return new Promise(function(resolve, reject) {  
        // Do async job
        request(req_url, function (error, response, body) {
            try {
                if (error) {
                    console.log('lookup()>', error);
                    reject(error);
                }else {                    
                    resolve(body)                    
                }
            } catch (e) {
                console.log('lookup()>', e);          
            } 
        });  
    }); 
}

/*************** Step_6: Process the response from lookup method ***************/

/**
 * Process the response to get the synonyms and pos values
 * Note: Since I am using lang 'en-en' API returns all the possible meanings of the input word. 
 * Each meaning of word has 'pos' and the list of synonyms. Also each synonym also has 'pos'
 * In this function I will list synonyms and corresponding pos only
 * @param {*} word 
 */
async function procesDicResults(word){
    let dict_json = JSON.parse(await lookup(word))
    let syn_list; //To store synonym JSON array from API response
    let synonym= [] //To store final list of synonym values for input word
    let pos= [] ////To store final list of pos values for input word
    if(dict_json.def[0]){
        let tr_list = dict_json.def[0].tr
        for (let tr in tr_list){
            if(tr_list[tr].syn){
                syn_list = tr_list[tr].syn;
                for (let syn in syn_list){
                    //console.log('text=', syn_list[syn].text, 'pos=', syn_list[syn].pos)
                    synonym.push(syn_list[syn].text);
                    pos.push(syn_list[syn].pos);                
                }            
            }        
        }
    }    
    return [synonym,pos]    
}

/*************** Step_7: Create word list JSON object ***************/

/**
 * Create final JSON object as per the requirement
 * @param {*} word 
 * @param {*} wordCount 
 * @param {*} syn_array 
 * @param {*} pos_array 
 */
function wordsList(word, wordCount, syn_array, pos_array){
    var output = {
        text: word,
        count: wordCount,
        synonyms: syn_array,
        pos: pos_array
    };
    wordList['word'].push(output);
}