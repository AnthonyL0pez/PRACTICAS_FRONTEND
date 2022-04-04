const vURLAPI = `https://pokeapi.co/api/v2/pokemon`;
const txtElementId = document.getElementById("txtNamePokemon");
const imgElementId = document.getElementById("imgPokemon");
const vImgDefault = "img/pokemon_cry.jpg";
const txtNamesPokemon = document.getElementById("txtNamesPokemon");
const txtWeightPokemon = document.getElementById("txtWeightPokemon");
const txtHeightPokemon = document.getElementById("txtHeightPokemon");
const txtTypePokemon = document.getElementById("txtTypePokemon");
const tblStats = document.getElementById("tblStats");
const txaMovesPokemon = document.getElementById("txaMovesPokemon");
const btnPrevious = document.getElementById("btnPrevious");
let vLimit = 0;

async function getQueryAPI(pURL)
{
    let vResponseAPI = 
    await fetch(pURL)
    .then
    (
        (vResponseAPI)=>
        {
            if(vResponseAPI.status == 200)
            {
                return vResponseAPI.json();
            }
            else
            {
                return{ id : 0, ok : vResponseAPI.ok, status : vResponseAPI.status  };
            }
        }
    )
    .catch( (vError) => { return { id : 0, error : vError } } );
    
    return vResponseAPI;
}

async function setDataPokemon(pID = -1)
{
    let vNamePokemon;

    if(pID >= 0) { vNamePokemon = pID; txtElementId.value = ""; }
    else{ vNamePokemon = txtElementId.value.toLowerCase(); }
    
    let vDataAPI = await getQueryAPI(vURLAPI+'/'+vNamePokemon);

    if( vDataAPI.id != 0 )
    {
        setImagePokemon(vDataAPI);
        setInfoPokemon(vDataAPI);
    }
    else
    {
        setImagePokemon(vImgDefault);
    }
    
}

function setImagePokemon (vDataAPI)
{
    let vImageAPI = vDataAPI.sprites.other.home.front_default;
    imgElementId.src = vImageAPI;
}
 
function setInfoPokemon(pData)
{
    let objAbilities = [];
    let objMoves = [];

    pData.abilities.forEach
    (
        vElement => { objAbilities.push(vElement.ability.name); }
    )

    pData.moves.forEach
    (
        vElement => { objMoves.push(vElement.move.name); }
    )
   
    let objInfoPokemon = 
    {
        vId : pData.id,
        vName : pData.name,
        vType : pData.types[0].type.name,
        vHeight : pData.height,
        vWeight : pData.weight,
        vStats : pData.stats,
        vAbilities : objAbilities,
        vMoves : objMoves   
    }
    
    setDescriptionPokemon(objInfoPokemon);
}

function setDescriptionPokemon(pObject)
{
    txtNamesPokemon.value = "#00"+pObject.vId+"-"+pObject.vName;
    txtWeightPokemon.value = pObject.vWeight;
    txtHeightPokemon.value = pObject.vHeight;
    txtTypePokemon.value = pObject.vType;
    let cadena ="";
    
    pObject.vStats.forEach
    (
        vElement => 
        {
            cadena += "<tr>"+
                        "<td>"+vElement.stat.name+"</td>"+
                        "<td>"+vElement.base_stat+"</td>"+
                    "</tr>";
        }
    );

    $("#tblStats").html("<tr><th colspan='2'>ESTADISTICAS</th></tr>"+cadena);
    $("#txaMovesPokemon").html(pObject.vMoves+"<br>")
}


fnQueryAPILimit();


async function fnQueryAPILimit(pLimit = 0)
{
    if(pLimit == 1)
    {
        $('#btnPrevious').prop('disabled', false);
        vLimit = vLimit + pLimit;
        pLimit = vLimit*15;
    }
    else if (pLimit == -1)
    {
        vLimit = vLimit - 1; 
        pLimit = vLimit*15;
    }

    if(pLimit == 0 && vLimit == 0)
    {
        $('#btnPrevious').prop('disabled', true);
    }

    let vLimits = vURLAPI+`?limit=15&offset=${pLimit}`;    
    let vDataAPI = await getQueryAPI(vLimits);

    if( vDataAPI.id != 0 )
    {
        let cadena ="";
        for (let index = 0; index < vDataAPI.results.length; index++) 
        {
            const vData = await getQueryAPI(vDataAPI.results[index].url);
            
            cadena += 
            `<div class="col-sm-12 col-md-6 col-lg-4">
                <img src="${vData.sprites.other.home.front_default}" class="d-block w-100" alt="..." onclick="setDataPokemon(${vData.id})">
                <h6">${"#00"+vData.id + "- "+ vData.name}</h6>
            </div>`;
        }
        
        $("#rciPokedex").html(cadena);      
    }
}