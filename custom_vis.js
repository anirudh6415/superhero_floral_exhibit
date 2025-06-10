const PETAL_SHAPES = [
    'M0,0 C50,40 50,70 20,100 L0,85 L-20,100 C-50,70 -50,40 0,0',
    'M-35,0 C-25,25 25,25 35,0 C50,25 25,75 0,100 C-25,75 -50,25 -35,0',
    'M0,0 C50,25 50,75 0,100 C-50,75 -50,25 0,0'
]

const GENDER_COLORS = {
    'male': '#444444',
    'female' : '#D27D8E',
    '-' : '#D8C8A2'
}
const genderToShapeMap = {
    'male': 0,
    'female' : 1,
    '-' : 2
}

const FLOWERS_PER_PAGE = 48;
let currentPage = 1;


function loadcsvdata(){
    d3.csv('dataset/superheroes_data_new.csv').then((data)=>{
        drawpetallegend(data);
        drawnumber_of_petalslegend(data);
        drawscalelegend(data);
        drawFlowers(data);
    })
};

loadcsvdata();
function drawpetallegend(data){
    const svgWidth = 800;
    const svgHeight = 130;
    const flowerSpacing = 150;

    const svg = d3.select('#legends-petals')
                .append('svg')
                .attr('width',svgWidth)
                .attr('height',svgHeight);

    const legendGroup = svg.append('g')
        .attr('transform', 'translate(20, 40)');

    svg.append('text')
        .text('Gender')
        .attr('x', svgWidth / 2)
        .attr('y', 20)
        .style('font-size', '20px')
        .style('fill', '#333')
        .style('text-anchor', 'middle');

    const genderTypes = Object.keys(genderToShapeMap);

    const maxPetals = PETAL_SHAPES.length;
    const spacing = svgWidth / (maxPetals + 1);
    const scaleFactor = 0.5;

    legendGroup.selectAll('path')
        .data(genderTypes)
        .enter()
        .append('path')
        .attr('d', d => PETAL_SHAPES[genderToShapeMap[d]])
        .attr('transform', (d, i) => `translate(${(i + 1) * spacing}, 0) scale(${scaleFactor})`)
        .attr('fill', 'none')
        .attr('stroke', function(d) {
            return GENDER_COLORS[d.charAt(0) + d.slice(1)] || 'gray';
        })
        .attr('stroke-width', 4);

    legendGroup.selectAll('text')
        .data(genderTypes)
        .enter()
        .append('text')
        .text(d => d.charAt(0).toUpperCase() + d.slice(1))
        .attr('x', (d, i) => (i + 1) * spacing)
        .attr('y', 50 + 15)
        .style('font-size', '14px')
        .style('fill', '#333')
        .style('text-anchor', 'middle');


}

function drawnumber_of_petalslegend(data){
    const svgWidth =800;
    const svgHeight = 180;
    const flowerSpacing =150;

    const svg = d3.select('#legends-flower')
                .append('svg')
                .attr('width',svgWidth)
                .attr('height',svgHeight);

    const countMinMax = d3.extent(data, d => +d.strength);
    const numPetalScale = d3.scaleQuantize()
                            .domain(countMinMax)
                            .range([3,7,10,20,30]);

    const binValues = [3,7,10,20,30].map(numPetals =>{
        const minstrength = d3.min(data.filter(d=>numPetalScale(d.strength)=== numPetals),d=> +d.strength);
        const maxstrength = d3.max(data.filter(d=>numPetalScale(d.strength)=== numPetals),d=> +d.strength);
        return {numPetals,minstrength,maxstrength}
    });


    svg.append('text')
        .text('Strength')
        .attr('x', svgWidth / 2)
        .attr('y', 20)
        .style('font-size', '20px')
        .style('fill', '#333')
        .style('text-anchor', 'middle');

    const flowers = svg.selectAll('g')
        .data(binValues)
        .enter()
        .append('g')
        .attr('transform', (d, i) => {
            const x = (i % 5) * flowerSpacing + 100; 
            const y = Math.floor(i / 5) * flowerSpacing + 100;  
            return `translate(${x}, ${y})`;
        });

    flowers.selectAll('path')
        .data(d => Array.from({ length: d.numPetals }, (_, i) => ({
            angle: (360 * i) / d.numPetals,  
            petalShape: PETAL_SHAPES[2],  
        })))
        .enter()
        .append('path')
        .attr('d', d => d.petalShape) 
        .attr('transform', d => `rotate(${d.angle}) scale(0.3)`)  
        .attr('fill', 'none')
        .attr('stroke', '#D27D8E')
        .attr('stroke-width', 4);

    flowers.append('text')
        .text(d => `${d.minstrength.toFixed(1)} - ${d.maxstrength.toFixed(1)}`)
        .attr('text-anchor', 'middle')
        .attr('y', 60)  
        .style('font-size', '14px')
        .style('fill', '#333');
}

function drawscalelegend(data){
    const svgWidth = 800;
    const svgHeight = 200;
    const flowerSpacing = 150;

    const svg = d3.select('#legends-flower_scale')
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    
    const countMinMax = d3.extent(data, d => +d.intelligence);
    const numPetalScale = d3.scaleQuantize()
        .domain(countMinMax)  
        .range([0.2, 0.3, 0.4, 0.5, 0.6]);

        const binValues = [0.2, 0.3, 0.4, 0.5, 0.6].map(scaleFactor => {
            const minIntelligence = d3.min(data.filter(d => numPetalScale(d.intelligence) === scaleFactor), d => +d.intelligence);
            const maxIntelligence = d3.max(data.filter(d => numPetalScale(d.intelligence) === scaleFactor), d => +d.intelligence);
            return { scaleFactor, minIntelligence, maxIntelligence };
        });
    svg.append('text')
        .text('Intelligence')
        .attr('x', svgWidth / 2)
        .attr('y', 20)
        .style('font-size', '20px')
        .style('fill', '#333')
        .style('text-anchor', 'middle');
    
    const flowers = svg.selectAll('g')
        .data(binValues)
        .enter()
        .append('g')
        .attr('transform', (d, i) => {
            const x = (i % 5) * flowerSpacing + 100;  
            const y = Math.floor(i / 5) * flowerSpacing + 100; 
            return `translate(${x}, ${y})`;
        });

    flowers.selectAll('path')
        .data(d => Array.from({ length: 10 }, (_, i) => ({ 
            angle: (360 * i) / 10,  
            petalShape: PETAL_SHAPES[1],  
            scaleFactor: d.scaleFactor,
        })))
        .enter()
        .append('path')
        .attr('d', d => d.petalShape)  
        .attr('transform', d => `rotate(${d.angle}) scale(${d.scaleFactor})`)  
        .attr('fill', 'none')
        .attr('stroke', '#444444')
        .attr('stroke-width', 4);

    
    flowers.append('text')
        .text(d => `${d.minIntelligence.toFixed(1)} - ${d.maxIntelligence.toFixed(1)}`)  
        .attr('text-anchor', 'middle')
        .attr('y', 80)  
        .style('font-size', '14px')
        .style('fill', '#333');
}

function drawFlowers(data){
    const svgWidth = 1000;
    const svgHeight = 1400; 
    const flowerSpacing = 160;

    const svgContainer = d3.select('#flowers')
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    const strengthMinMax = d3.extent(data, d => +d.strength);
    const strengthScale = d3.scaleQuantize()
                            .domain(strengthMinMax)
                            .range([3, 7, 10, 20, 30]);

    const weightMinMax = d3.extent(data, d => +d.intelligence);
    const weightScale = d3.scaleQuantize()
                          .domain(weightMinMax)
                          .range([0.2, 0.3, 0.4, 0.5, 0.6]);

    const flowersData = data.map((d) => {
        const numPetals = strengthScale(+d.strength); 
        const petalShapeIndex = genderToShapeMap[d.gender.toLowerCase()] || 0;
        const petalShape = PETAL_SHAPES[petalShapeIndex];
        const scaleFactor = weightScale(+d.intelligence);


        return {
            name: d.name,
            numPetals,
            petalShape,
            scaleFactor,
            strengthBin: numPetals,  
            weightBin: scaleFactor,
            alignment: d.alignment,   
            strength: d.strength,  
            gender: d.gender,      
            intelligence: d.intelligence,  
            url: d.url
        };
    });


    const totalFlowers = flowersData.length;
    const totalPages = Math.ceil(totalFlowers / FLOWERS_PER_PAGE);
    let currentPage = 1;

    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    const pageNumbersContainer = document.getElementById('pageNumbers');

    function updatePaginationControls() {
        prevButton.disabled = currentPage === 1;  
        nextButton.disabled = currentPage === totalPages; 
        updatePageNumbers();
    }

    function updatePageNumbers() {
        pageNumbersContainer.innerHTML = ''; 

        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }

        pageNumbers.forEach(pageNum => {
            const pageLink = document.createElement('span');
            pageLink.textContent = pageNum;
            pageLink.classList.add('page-link');
            pageLink.style.cursor = 'pointer';
            if (pageNum === currentPage) {
                pageLink.style.fontWeight = 'bold'; 
            }
            pageLink.addEventListener('click', function () {
                currentPage = pageNum;
                drawFlowersForPage(currentPage); 
            });
            pageNumbersContainer.appendChild(pageLink);

            if (pageNum < totalPages) {
                pageNumbersContainer.appendChild(document.createTextNode(' '));
            }
        });
    }

    function drawFlowersForPage(page) {
        
        svgContainer.selectAll('*').remove();

        
        const startIndex = (page - 1) * FLOWERS_PER_PAGE;
        const endIndex = Math.min(page * FLOWERS_PER_PAGE, totalFlowers);
        const flowersForPage = flowersData.slice(startIndex, endIndex);

        const tooltip = d3.select('body').append('div')
        .attr('id', 'tooltip')
        .style('position', 'absolute')
        .style('background-color', 'black')
        .style('color', 'white')
        .style('border-radius', '5px')
        .style('padding', '5px')
        .style('opacity', 0);

        
        const flowers = svgContainer.selectAll('g')
            .data(flowersForPage)
            .enter()
            .append('g')
            .attr('transform', (d, i) => {
                const x = (i % 6) * flowerSpacing + 100; 
                const y = Math.floor(i / 6) * flowerSpacing + 100; 
                return `translate(${x}, ${y})`;
            })
            .style('cursor', 'pointer');


        flowers.selectAll('path')
            .data(d => Array.from({ length: d.numPetals }, (_, i) => ({
                angle: (360 * i) / d.numPetals,
                petalShape: d.petalShape,
                scaleFactor: d.scaleFactor,
                gender: d.gender || 'unknown'
            })))
            .enter()
            .append('path')
            .attr('d', d => d.petalShape)
            .attr('transform', d => `rotate(${d.angle}) scale(${d.scaleFactor})`)
            .attr('fill', 'white')
            .attr('stroke', function(d) {
                return GENDER_COLORS[d.gender.toLowerCase()] || 'gray'; 
            })
            .attr('stroke-width', 4)
            .attr('fill-opacity', 0)
            .on('mouseover', function(event, d) {
                const flowerData = d3.select(this.parentNode).datum(); 
                tooltip.transition().duration(200).style('opacity', .9); 
                tooltip.html(`
                    <strong>Name:</strong> ${flowerData.name} <br>
                    <strong>Alignment:</strong> ${flowerData.alignment} <br>
                    <strong>Strength:</strong> ${flowerData.strength} <br>
                    <strong>Gender:</strong> ${flowerData.gender} <br>
                    <strong>Intelligence:</strong> ${flowerData.intelligence}
                `)
                .style('left', (event.pageX + 5) + 'px')
                .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function() {
                tooltip.transition().duration(500).style('opacity', 0); 
            });

     
        flowers.append('text')
            .text(d => d.name)
            .attr('text-anchor', 'middle')
            .attr('y', 80)
            .style('font-size', '14px')
            .style('fill', '#333');
        
        
        flowers.on('click', function(event, d) {
            if (d.url) {
                window.open(d.url, '_blank');  
            }
        });

        updatePaginationControls();
    }

    
    drawFlowersForPage(currentPage);

    
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            drawFlowersForPage(currentPage);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            drawFlowersForPage(currentPage);
        }
    });
}