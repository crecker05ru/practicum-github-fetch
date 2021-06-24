const form = document.querySelector('.search__form');
const resultsContainer = document.querySelector('.search__findings-list');
const countContainer = document.querySelector('.search__findings');
const errorContainer = document.querySelector('.search__error');

form.addEventListener("submit",onSubmit)
const renderError = () => {
  errorContainer.innerHTML = `
        <img src="https://code.s3.yandex.net/web-code/entrance-test/search.svg" alt="" class="search__error-icon" />
        <p class="search__error-message">
            Произошла ошибка...
        </p>
  `;
  countContainer.innerHTML = '';
};

const renderEmptyResults = () => {
  errorContainer.innerHTML = `
        <img src="https://code.s3.yandex.net/web-code/entrance-test/search.svg" alt="" class="search__error-icon" />
        <p class="search__error-message">
            По вашему запросу ничего не найдено, попробуйте уточнить запрос
        </p>
  `;
  countContainer.innerHTML = '';
};

const renderCount = count => {
  countContainer.innerHTML = `
      Найдено <span class="search__findings-amount">${count.toLocaleString(
        'ru-RU'
      )}</span> результатов
  `;
};

const onSubmitStart = () => {
  countContainer.innerHTML = `Загрузка...`;
  resultsContainer.innerHTML = '';
  errorContainer.innerHTML = '';
};

function template(item) {
  const newElement = document.createElement('li');
  newElement.classList.add('search__finding-item');
  newElement.innerHTML = `
  <a class="search__finding-link" target="_blank" href=${item.html_url}>${item.full_name}</a>
  <span class="search__finding-description">${item.description}</span>
	`;
  // document.body.appendChild(newElement)
  return newElement;
}

async function onSubmit(event) {
  // ваш код
  event.preventDefault()
  onSubmitStart()
  await fetch(`https://api.nomoreparties.co/github-search?q=${form.title.value}`)
  .then((response) => {
      return response.json()
  })
  .then((data)=> {
      console.log(data)
      console.log(data.items)
      const {items} = data
      // console.log(items)
      // items.map(item => template(item))
      console.log(data.items.map(item => template(item)))
      console.log(template(data.items[0]))
      if(data.total_count === 0){
        renderEmptyResults()
      }else if (data.total_count !== 0){
        renderCount(data.total_count)
        let result = ``
        for (let item of data.items){
          console.log('template',template(item))
          result += template(item).outerHTML
          
          // resultsContainer.innerHTML = template(item).outerHTML
        }
        console.log('result',result)
        resultsContainer.innerHTML = result
        
        // resultsContainer.innerHTML = `${data.items.map(item => template(item))}`
        // for(let i = 0; i < data.items.length; i++){
        //   console.log(template(data.items[i]))
        //     return template(data.items[i])
        // }
      }
      
  })
  .catch((error) => {
      renderError()
      console.log(error)
  })

  // alert('submit')
}

