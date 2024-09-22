import './styles.scss'

const HEADER = document.querySelector('header')

// Prefent default for every link on the page
const A_TAGS = document.querySelectorAll('a')
A_TAGS.forEach(link => link.addEventListener('click', (e) => e.preventDefault()))

// The main api url from env file
const TEST_API_URL = import.meta.env.VITE_TEST_API_URL

let pageNumber = 1
let pageSize = 50
let loading = false

const grid = document.getElementById('grid')
const pageSizeDropdown = document.getElementById('pageSize')

// Function for fetching data from the API
async function fetchData(pageNumber, pageSize) {
	try {
		const response = await fetch(`${TEST_API_URL}?pageNumber=${pageNumber}&pageSize=${pageSize}`)
		
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		
		const data = await response.json()
		
		return data.data
	} catch (error) {
		console.error('Error fetching data:', error)
	}
}

// Function for rendering the grid items
function renderGrid(items) {
	items.forEach(item => {
		const box = document.createElement('div')
		box.classList.add('products__grid-element')
		box.textContent = `ID: ${item.id}`
		grid.appendChild(box)
		
		box.addEventListener('click', () => {
			modalActivation(item)
		})
		
	})
}

// Function for loading and rendering new data
async function loadMore() {
	if (loading) return
	loading = true
	const data = await fetchData(pageNumber, pageSize)
	if (data) {
		renderGrid(data)
		pageNumber++
	}
	loading = false
}

// Scroll event listener
window.addEventListener('scroll', () => {
	if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 100) {
		loadMore()
	}
})

// Event listener for dropdown change
pageSizeDropdown.addEventListener('change', (event) => {
	pageSize = parseInt(event.target.value)
	pageNumber = 1
	grid.innerHTML = ''
	loadMore()
})

// Initial load
loadMore()


//Function for modal window set up
function modalActivation(item) {
	const popap = document.querySelector('.popap')
	const popapClose = document.querySelector('.popap__content-close')
	const popapBody = document.querySelector('.popap__content-body')
	
	document.body.classList.add('_lock')
	
	popapBody.innerHTML = `
		<span>Nazwa:${item.name}</span>
		<span>Wartość: ${item.value}</span>
	`
	
	popap.classList.toggle('_active')
	popapClose.addEventListener('click', () => {
		popap.classList.remove('_active')
		document.body.classList.remove('_lock')
	})
	
	window.onclick = function(event) {
		if (event.target == popap) {
			document.body.classList.remove('_lock')
			popap.classList.remove('_active')
		}
	}
}


// "Parallax" effect for the dog
window.addEventListener('scroll', function() {
	const parallaxElement = document.querySelector('.composition__dog-img')
	const scrollPosition = window.scrollY
	
	parallaxElement.style.width = `${scrollPosition / 56}%`
	parallaxElement.style.paddingBottom = `${scrollPosition / 90}%`
	
})


// Smooth scroll to section
const menuLinks = document.querySelectorAll('[data-goto]')

menuLinks.forEach(function(menuLink) {
	menuLink.addEventListener('click', function() {
		const gotoBlockId = this.getAttribute('data-goto')
		const gotoBlock = document.querySelector(`#${gotoBlockId}`)
		console.log(gotoBlock)

		if (gotoBlock) {
			const gotoBlockValue = gotoBlock.offsetTop - HEADER.offsetHeight

			window.scrollTo({
				top: gotoBlockValue,
				behavior: 'smooth'
			})
		}
	})
})


//
window.addEventListener("scroll", function() {
  const scrollDistance = window.scrollY;
  const sections = document.querySelectorAll("section");
  const headerHeight = HEADER.offsetHeight;

  sections.forEach(section => {
    const sectionId = section.id;
    if (section.offsetTop - headerHeight <= scrollDistance && section.offsetTop + section.offsetHeight > scrollDistance) {
      document.querySelectorAll(".menu__link.active").forEach(link => link.classList.remove("active"));
			
      const newActiveLink = document.querySelector(`.menu__link[data-goto="${sectionId}"]`);
      if (newActiveLink) {
        newActiveLink.classList.add("active");
      }
    }
  });
});


