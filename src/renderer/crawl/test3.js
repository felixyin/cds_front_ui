// const delay = require('delay');
// const PQueue = require('p-queue');
const {crawl, crawl2} = require('../crawl/test2');
// const global = require('global');
// const process = require('process');
// const easyMonitor = require('easy-monitor');
// easyMonitor('cds');

// const queue = new PQueue({concurrency: 100});

let list = ['https://furniture.cort.com/', 'https://www.thefurnituremart.com/', 'https://www.furnitureinfashion.net/', 'https://unfinishedfurnitureexpo.com/', 'https://southjersey.craigslist.org/search/fua', 'https://qualityfurniturediscounts.com/', 'https://www.howellfurniture.com/', 'https://www.thehardwarehut.com/furniture.php', 'https://www.pilgrimfurniturecity.com/', 'https://bernhardt.com/', 'https://www.alibaba.com/showroom/furniture.html', 'http://awfco.com/', 'http://www.miamifurniture.com/', 'https://sfbay.craigslist.org/search/fua', 'https://sfbay.craigslist.org/search/fua', 'https://www.myfurnituremarket.com/', 'https://www.howellfurniture.com/', 'https://www.pilgrimfurniturecity.com/', 'https://phoenix.craigslist.org/search/evl/fua', 'https://www.furnituremedic.com/', 'https://www.bulkea.com/', 'http://awfco.com/', 'https://stores.ashleyfurniture.com/', 'https://www.bakerfurniture.com/', 'http://www.399sofastore.com/', 'http://www.wordreference.com/enit/furniture', 'https://www.dunelm.com/category/home-and-furniture/furniture', 'https://www.katyfurniture.com/', 'https://cosprings.craigslist.org/search/fua', 'https://www.hayneedle.com/baby-and-kids/kids-furniture_183729', 'http://www.wordreference.com/definition/furniture', 'https://inlandempire.craigslist.org/search/fua', 'http://www.ffdm.com/', 'https://leadersfurniture.com/', 'http://www.brambleco.com/', 'https://jerseyshore.craigslist.org/search/fua', 'https://www.homelivingfurniture.com/', 'http://www.pbteen.com/', 'https://marquis-furniture.squarespace.com/', 'https://www.custommade.com/gallery/fine-custom-furniture/', 'https://binghamton.craigslist.org/search/fua', 'https://www.afw.com/', 'https://www.afw.com/', 'https://greenbay.craigslist.org/search/fua', 'http://www.vigfurniture.com/',
    'https://www.britannica.com/topic/furniture-industry', 'https://www.furniturerentals.com/', 'https://www.duralee.com/Furniture.htm', 'http://www.furnitureconnexion.com/', 'http://www.highpointmarket.org/', 'https://www.lowes.ca/furniture/', 'http://www.proglobal-furniture.com/', 'https://minneapolis.craigslist.org/search/fua', 'http://www.wigginsfurniture.net/', 'https://orlando.craigslist.org/search/fua', 'http://www.hekman.com/', 'http://www.wigginsfurniture.net/', 'http://www.simplybabyfurniture.com/', 'https://www.uship.com/furniture/', 'https://www.steelcase.com/', 'http://catnapper.com/', 'https://www.roomstogokids.com/', 'http://www.hawaiidiscountfurniture.com/', 'https://www.countrycasualteak.com/', 'https://www.vafurnituremarket.com/', 'https://maine.craigslist.org/search/fua', 'https://www.homelivingfurniture.com/rc2/living-room-furniture', 'https://www.interiors-furniture.com/', 'https://www.cca.edu/design/furniture/', 'https://bernadettelivingston.com/', 'https://bernadettelivingston.com/', 'https://www.amazon.co.uk/Furniture-Kitchen-Home-Garden/b?ie=UTF8&node=10745681', 'https://www.homfurniture.com/location/onalaska', 'https://www.vafurnituremarket.com/', 'https://www.gormans.com/', 'https://www.onlineamishfurniture.com/', 'http://www.baxtonstudio.com/', 'https://www.ebay.com/bhp/vintage-furniture', 'https://www.americasfurniturewhse.com/', 'https://www.furniturelandsouth.com/', 'https://phoenix.craigslist.org/search/fuo', 'https://sd.craigslist.org/search/fua', 'https://chattanooga.craigslist.org/search/fua', 'https://www.morfurniture.com/storelocator', 'https://www.morfurniture.com/storelocator', 'https://allentown.craigslist.org/search/fua', 'https://lanefurniture.com/', 'https://www.blockersfurniture.com/',
    'https://www.homedit.com/category/furniture/', 'http://vanguardfurniture.com/', 'https://www.furniturelandsouth.com/', 'http://furninfo.com/', 'http://furniturebanks.org/us/', 'https://www.goodshomefurnishings.com/furniturefactoryoutlets/', 'https://wheeling.craigslist.org/search/fua', 'https://www.americanhome.com/', 'https://www.flemingtondepartmentstore.com/', 'https://www.archboldfurniture.com/', 'https://www.flemingtondepartmentstore.com/', 'https://www.archboldfurniture.com/', 'http://www.hennenfurniture.com/', 'https://www.mylibertyfurniture.com/', 'https://www.haworth.com/', 'https://www.furnituremedic.com/contact-us/', 'https://www.cnn.com/2019/02/27/us/mother-daughter-charged-killings-pennsylvania/index.html', 'https://www.rowefurniture.com/', 'https://www.chairish.com/', 'http://italy2000usa.com/', 'http://www.connectedlines.com/styleguide/', 'https://denver.craigslist.org/search/fuo', 'https://globalfurnitureusa.com/', 'https://www.yelp.com/biz/bobs-discount-furniture-new-york-3', 'https://www.yelp.com/search?cflt=furniture&find_loc=Boca+Raton%2C+FL', 'https://www.talsmafurniture.com/', 'http://efrental.com/', 'https://www.mybobs.com/outlet', 'http://www.hennenfurniture.com/', 'http://www.afrevents.com/', 'http://www.usedfurnitureindenver.com/', 'https://www.stowersfurniture.com/', 'https://www.templeandwebster.com.au/Furniture-C1812305.html', 'http://www.hickorychair.com/', 'https://www.hickoryfurniture.com/', 'http://www.furnituremattresses.net/', 'https://fargo.craigslist.org/search/fua', 'https://furniture.made-in-china.com/', 'https://www.easternfurniture.com/', 'https://www.furnituresolutionsinc.net/', 'https://www.tradeindia.com/Seller/Furniture/', 'https://www.gowfb.com/', 'http://www.evensonbest.com/', 'https://www.snapdeal.com/products/furniture',
    'https://orangecounty.craigslist.org/search/fua', 'https://www.wikihow.com/Stop-a-Cat-from-Clawing-Furniture', 'https://detroit.craigslist.org/search/fua', 'http://www.furniturediscountwarehouse.com/', 'https://www.arizonaleather.com/', 'https://www.fashionfurniture.com/', 'https://www.leons.ca/', 'https://www.offers.com/c/furniture/', 'https://www.offers.com/c/home/', 'https://www.offers.com/c/furniture/', 'https://www.offers.com/c/home/', 'https://www.cymax.com/', 'https://www.leons.ca/', 'https://www.westrichfurniture.com/', 'http://www.furniturediscountwarehouse.com/', 'http://salonsmart.com/', 'https://www.shipshewanafurniture.com/', 'https://jrfurniture.com/', 'http://www.furniture-china.cn/en-us', 'http://www.hanksfurniture.com/', 'https://furniturewizard.com/', 'https://www.speedyfurniture.com/', 'https://www.officedepot.com/', 'https://www.hon.com/', 'https://www.barnfurnituremart.com/', 'http://www.furnitureconsignment.com/', 'https://www.vam.ac.uk/collections/furniture', 'https://www.fedde.com/', 'https://www.blueprintfurniture.com/', 'https://sanfordunfinishedfurniture.com/catalog/', 'https://ozdesignfurniture.com.au/furniture', 'https://dallas.craigslist.org/search/fuo', 'https://www.castlery.com/', 'https://www.cotswoldco.com/', 'http://www.cincinnatifurnitureoutlet.com/', 'https://www.americancountryhomestore.com/', 'http://www.sherrillfurniture.com/', 'https://www.debenhams.com/furniture', 'https://www.debenhams.com/furniture', 'https://kellyhoppeninteriors.com/furniture/', 'http://www.vawayside.net/', 'http://www.palmdalefurnitureclub.com/', 'http://www.directfactoryfurniture.com/', 'https://www.telescopecasual.com/', 'https://www.cortevents.com/',
    'https://www.usatoday.com/story/tech/reviewedcom/2019/02/19/the-12-best-pieces-from-walmarts-new-affordable-furniture-collection/39078001/', 'https://www.usatoday.com/story/tech/reviewedcom/2019/02/19/the-12-best-pieces-from-walmarts-new-affordable-furniture-collection/39078001/', 'http://www.homestyles-furniture.com/', 'http://www.7dayfurniture.net/', 'https://www.essentialhome.eu/', 'https://www.smartfurniture.com/studio.html', 'https://furnitureandthings.com/', 'https://www.designfurnishings.com/', 'https://furnitureandthings.com/', 'https://www.designfurnishings.com/', 'http://www.totallyfurniture.com/', 'https://www.onewayfurniture.com/', 'https://www.furniture.co.nz/', 'https://www.vogue.com/article/artist-turning-family-into-chairs', 'https://www.vinterior.co/', 'https://www.buybuybaby.com/', 'https://www.jenniferfurniture.com/', 'http://www.seldens.com/', 'https://www.fantasticfurniture.com.au/', 'https://www.worthingtondirect.com/', 'https://www.concretenetwork.com/concrete/furniture/', 'https://www.riverside-furniture.com/', 'https://www.worthingtondirect.com/', 'https://www.concretenetwork.com/concrete/furniture/', 'https://www.fantasticfurniture.com.au/', 'https://www.riverside-furniture.com/', 'https://www.weaverfurnituresales.com/', 'http://upscaleconsignment.com/', 'https://fortmyers.craigslist.org/search/fua', 'http://www.rvfurniturecenter.com/', 'http://www.youngerfurniture.com/', 'https://www.modernmiami.com/', 'https://homebnc.com/best-diy-outdoor-furniture-projects-ideas/', 'https://homebnc.com/topic/diy-projects/', 'https://www.cymax.com/bedroom-furniture--PC330.htm', 'http://www.furnitureworldsuperstore.net/', 'https://www.uhaul.com/MovingSupplies/Packing-Supplies/Furniture-Pad/?id=2670',
    'https://www.uhaul.com/MovingSupplies/Packing-Supplies/Furniture-Pad/?id=2670', 'http://www.furnitureworldsuperstore.net/', 'https://www.eurofurniture.com/', 'http://www.chicagofurnitureonlinestore.com/', 'https://www.centuryfurniture.com/', 'https://www.harpersbazaar.com/celebrity/latest/a26608747/courteney-cox-pivot-video-instagram-johnny-mcdaid/', 'https://www.harpersbazaar.com/celebrity/latest/a26608747/courteney-cox-pivot-video-instagram-johnny-mcdaid/', 'http://bifusa.com/', 'http://www.vaughan-bassett.com/', 'https://hillsdalefurniture.com/', 'https://seekingalpha.com/article/4222054-bassett-furniture-not-bad-enough', 'http://www.rockymountaindecor.com/Rustic-Furniture', 'https://cottagehomefurniture.com/', 'http://www.learnersdictionary.com/definition/furniture', 'http://www.lafuente.com/Rustic-Furniture/', 'https://freshome.com/30-small-bedrooms-ideas-to-make-your-home-look-bigger/', 'https://walkerfurniture.com/en/', 'https://www.sofamania.com/', 'https://www.splitwise.com/calculators/furniture', 'https://www.americangirl.com/shop/ag/nursery', 'https://seattle.craigslist.org/search/fua', 'http://www.furnitureinsacramentoca.com/', 'http://furnitureforlessfargo.com/', 'https://www.the-cover-store.com/', 'https://www.globalfurnituregroup.com/', 'http://www.butlerspecialty.net/', 'http://www.lafuente.com/Mexican-Furniture/Rustic-Pine-Furniture/', 'http://lyndon.com/', 'http://www.furniturerent.com/', 'http://www.furniturerent.com/', 'http://www.martinfurniture.com/', 'https://www.samlevitz.com/', 'http://www.urbanhome.com/', 'http://www.peacefulvalleyfurniture.com/', 'https://www.tansu.net/', 'http://doerrfurniture.com/', 'http://expressfurniture.net/', 'http://www.bestcraftfurniture.com/', 'http://www.leeindustries.com/',
    'http://www.thefreedictionary.com/article+of+furniture', 'http://furnitureaffair.com/', 'http://www.bograds.com/', 'http://sandiegorustic.com/', 'http://www.startribune.com/minneapolis-woodworker-crafts-custom-furniture-inspired-by-art/503631232/', 'https://www.woodenstreet.com/', 'http://westwoodfurniture.com/', 'https://www.familyleisure.com/Casual-Patio-Furniture', 'https://www.familyleisure.com/Casual-Patio-Furniture/Fire-Pit-Sets', 'https://www.familyleisure.com/Patio-Accessories', 'http://www.oldcanneryfurniture.com/', 'http://www.whitewoodfurniture.com/', 'https://www.madburyroad.com/', 'http://amishamerica.com/amish-furniture/', 'http://www.carolinarustica.com/', 'http://www.ana-white.com/', 'http://tristateofficefurniture.com/', 'http://www.auctionzip.com/furniture.html', 'http://doerrfurniture.com/', 'https://www.smartfurniture.com/', 'https://www.furnitureleisure.com/', 'https://www.smartfurniture.com/', 'https://www.retailmenot.com/coupons/furniture', 'http://www.sbfx.com/', 'https://sandiego.craigslist.org/search/fua', 'http://www.mmfurniture.com/', 'http://www.furnitureplus.com/', 'https://drsofa.com/', 'http://www.restaurantfurniture.net/', 'https://expandfurniture.com/', 'http://www.bissellwoodworking.com/', 'http://www.zfurniture.com/', 'http://www.powellcompany.com/', 'https://www.intercon-furniture.com/', 'https://denver.craigslist.org/search/fua', 'https://www.forbes.com/sites/moneybuilder/2012/06/27/how-to-buy-quality-furniture/', 'https://raleigh.craigslist.org/search/fua', 'https://www.galleriafurn.com/', 'https://www.furnituresg.com.sg/', 'https://hollywoodlife.com/2019/03/03/courteney-cox-pivot-friends-moving-furniture-video/', 'https://hollywoodlife.com/2019/03/03/courteney-cox-pivot-friends-moving-furniture-video/',
    'https://hollywoodlife.com/topics/news/', 'https://hollywoodlife.com/topics/news/celebrity-news/', 'https://hollywoodlife.com/celeb/courteney-cox/', 'http://www.poshtots.com/Childs-Furniture/2639/PoshCategory.aspx', 'https://www.kmart.com/', 'https://www.popsugar.com/home/Affordable-Furniture-From-Amazon-45735037', 'https://www.popsugar.com/home/Affordable-Furniture-From-Amazon-45735037', 'https://www.popsugar.com/living', 'https://www.popsugar.com/Amazon', 'https://logfurnitureplace.com/', 'http://www.furnituremanor.com/', 'http://www.lqfurniture.com/', 'http://www.discountfurnitureofthecarolinas.com/', 'http://catalog.findyourfurniture.com/', 'https://omaha.craigslist.org/search/fua', 'http://dot-furniture.com/store/', 'https://www.thespruce.com/rules-for-arranging-furniture-2213418', 'https://broadwayfurniture.net/', 'https://www.furlenco.com/', 'http://www.awfurniture.com/', 'http://uhurudesign.com/category/furniture', 'https://limaohio.craigslist.org/search/fua', 'https://www.mrhandyman.com/handyman-services/assembly/', 'https://www.discogs.com/artist/108700-Furniture', 'http://www.todaysplans.com/free-woodwork-outdoor-projects.html', 'https://www.instructables.com/id/DIY-Furniture/', 'http://www.brodartfurniture.com/', 'http://www.kingmanfurniture.com/', 'https://winstonsalem.craigslist.org/search/fua', 'https://www.minecraftmods.com/furniture-mod/', 'http://2nddebutfurniture.com/', 'http://www.treeformsfurniture.com/', 'https://www.safekids.org/tv', 'http://www.daysfurniture.com/', 'https://www.teakcloseouts.com/', 'http://www.dci.delaware.gov/upholstery.shtml', 'http://louisfryfurniture.com/', 'https://madison.craigslist.org/search/fua', 'http://www.furnitureliquidatorsnc.com/', 'https://dubai.dubizzle.com/classified/furniture-home-garden/',
    'https://dubai.dubizzle.com/search/', 'https://dubai.dubizzle.com/classified/', 'https://cincinnati.craigslist.org/search/fua', 'http://www.thatfurniturestore.net/', 'https://madison.craigslist.org/search/fua', 'https://dubai.dubizzle.com/classified/furniture-home-garden/', 'https://dubai.dubizzle.com/search/', 'https://dubai.dubizzle.com/classified/', 'http://www.furnitureliquidatorsnc.com/', 'https://cincinnati.craigslist.org/search/fua', 'http://www.thatfurniturestore.net/', 'https://www.sunnylandfurniture.com/', 'http://www.daysfurniture.com/', 'https://fortmyers.craigslist.org/search/fud', 'https://xcella.ca/', 'https://houston.craigslist.org/search/fua', 'https://www.made.com/', 'https://www.ikeatingfurniture.com/', 'https://milwaukee.craigslist.org/search/fua', 'https://www.astarfurn.com/', 'http://www.patiostore.com/', 'https://www.jonathanlouis.net/', 'https://bloemfonteinremovals.co.za/', 'http://www.i35furniture.com/', 'https://www.dezeen.com/tag/furniture/', 'https://www.freedom.com.au/furniture', 'https://www.finefurnituremaker.com/', 'http://www.maxwoodfurniture.com/', 'https://www.marksandspencer.com/c/furniture/', 'http://lotsoffurniture.com/', 'https://www.pkfurniture.co.nz/', 'http://rioranchofurniture.com/', 'http://www.simplykidsfurniture.com/', 'http://www.thefurnitureconnoisseur.com/c/furniture-wax/', 'http://www.simplykidsfurniture.com/', 'http://www.thefurnitureconnoisseur.com/c/furniture-wax/', 'https://kingdinettes.com/', 'http://woodyouocala.com/', 'https://www.interiorsandsources.com/article-details/articleid/22377/title/reforest-deforestation', 'http://www.amkogroup.com/', 'https://www.my-furniture.com/', 'http://www.furnituredistributorsinc.biz/', 'https://gensuncasual.com/', 'https://www.brosa.com.au/', 'https://atc-craft.com/',
    'http://shakerworkshops.com/', 'http://baynesfurniture.com/', 'https://www.cnn.com/2019/02/06/investing/jcpenney-appliances/index.html', 'https://www.cnn.com/2019/02/06/investing/jcpenney-appliances/index.html', 'http://www.baileysfurniture.com/', 'http://hallfurniture.com/', 'http://www.myfurniturediscounters.com/', 'https://www.made.com/furniture/', 'http://tottini.com/', 'http://www.thefurnitureconnoisseur.com/c/furniture-polish/', 'http://jlfurniture.com/', 'https://www.hawkridgefurniture.com/', 'http://www.centuryfurniture.com/', 'http://www.interiorexpress.com/', 'http://www.surroundingsfurniture.com/', 'http://furniturefriends.org/', 'https://www.handy.com/services/furniture-assembly', 'https://www.handy.com/services/furniture-assembly', 'https://www.etsy.com/market/reclaimed_wood_furniture', 'http://www.cedarstore.com/', 'http://www.handpaintedbycookie.com/', 'https://www.wwgoa.com/woodworking-plans/', 'https://remixfurniturestore.com/', 'http://www.smartdecofurniture.com/', 'http://www.eliteleather.com/', 'https://seekingalpha.com/article/4226875-hooker-furniture-corporation-hoft-ceo-paul-toms-q3-2019-results-earnings-call-transcript', 'http://www.delandisfurniture.com/', 'http://amishwbf.com/', 'http://acim.umfk.maine.edu/furniture.html', 'http://three-h.com/', 'http://www.affordablefurniture.ms/', 'http://www.affordablefurniture.ms/', 'http://www.jlcfurniture.com/', 'http://www.furniturewholesalegroup.com/', 'https://www.tropitone.com/outdoor-furniture/residential', 'http://www.carolinafurnitureworks.com/', 'http://www.kuosfurnitureimports.com/', 'http://www.furnituremodern.com/', 'http://clevelandfurniturebank.org/', 'http://furnituremakingclasses.com/', 'http://www.motioncraft-furniture.com/', 'http://www.armandsfurniture.com/',
    'http://www.antonellisfurniture.com/', 'https://www.businessinsider.com/jb-hunt-cory-last-mile-furniture-delivery-service-2019-1', 'http://www.commercialfurnituregroup.com/', 'https://www.businessinsider.com/jb-hunt-cory-last-mile-furniture-delivery-service-2019-1', 'http://furnituremartga.com/', 'https://thaifurnituredecor.com/', 'http://www.sbwire.com/press-releases/global-square-tables-market-with-moderate-cagr-in-forecast-period-2019-to-2026-by-top-manufacturers-ki-furniture-lorell-marco-group-offex-and-others-1162060.htm', 'http://www.commercialfurnituregroup.com/', 'http://www.baxtonstudiooutlet.com/', 'https://www.heals.com/furniture.html', 'http://www.navanafurniture.com/', 'https://pathwaystohousingpa.org/furniture', 'https://www.patioproductions.com/', 'https://www.lauraashleyusa.com/', 'http://www.furniturefinders.com/', 'http://www.switchmodern.com/', 'https://openclipart.org/tags/furniture', 'https://openclipart.org/tags/furniture', 'http://www.myfurnitureforum.com/', 'https://furnitureservices.net/', 'http://www.fashionseating.com/', 'http://wholesale-furniture.hktdc.com/', 'http://www.hktdc.com/suppliers/china-wholesale-suppliers/en', 'http://functionfirstfurniture.com/', 'http://www.damroindia.com/', 'http://www.psfurniture.com/', 'https://www.amartfurniture.com.au/', 'http://chiceventfurniture.com/', 'https://homestarsdirect.com/', 'http://wallsfurniture.com/', 'http://woodworksfurniturestore.com/', 'http://www.furnitureandmattresswarehouse.com/', 'http://www.furnitureandmattresswarehouse.com/', 'http://woodworksfurniturestore.com/', 'http://www.leelaxpo.com/', 'https://www.seatingexpert.com/', 'http://www.bitterrootfurniture.com/', 'http://www.intertek.com/furniture/', 'http://www.intertek.com/industries-services/',
    'http://www.intertek.com/products-retail/', 'http://www.laviemodernfurniture.com/', 'https://www.radio-rentals.com.au/furniture', 'http://www.gardenarteu.com/', 'http://www.wagsfurniture.com/', 'https://www.gumtree.co.za/s-furniture/v1c9181p1', 'https://www.gumtree.co.za/s-home-garden/v1c9175p1', 'http://www.abcofurniture.net/', 'http://www.maineantiquefurniture.com/', 'https://fresno.craigslist.org/search/fua', 'http://www.potterybarn.ca/', 'http://plushpod.com/', 'https://ezmoves.com/', 'https://www.furniturebank.org/', 'http://www.peabodyoffice.com/', 'http://winstonfurniture.com/', 'https://www.casateak.com/', 'https://www.focusonfurniture.com.au/', 'http://abcofurniture.com/', 'http://fortpittfurniture.com/', 'http://www.furnitureforumusa.com/', 'http://stylespafurniture.com/', 'http://loungeappeal.com/', 'http://www.mkldfurniture.com/', 'http://www.mkldfurniture.com/', 'http://furniturepackagesusa.com/', 'http://www.vhfurniture.com/', 'http://www.palmersnyder.com/', 'http://theinsidetrackfurniture.com/', 'https://www.viesso.com/', 'http://www.theofficefurniturestore.com/', 'https://www.icff.com/', 'http://www.vermontfurnituremakers.com/', 'http://bryanashley.com/', 'https://www.aof.com/', 'http://furnishofficeandhome.org/', 'http://sandersfurniturewinder.com/', 'https://www.worldfurnitureonline.com/', 'http://sandersfurniturewinder.com/', 'https://www.nationalfurnituresupply.com/', 'https://homesteadfurnitureonline.com/', 'https://www.worldfurnitureonline.com/', 'http://www.woodworkshomefurnishings.com/', 'https://www.homelement.com/', 'http://furniture4schools.com/', 'http://www.furniturestorestockbridgega.com/', 'http://creativestylefurniture.com/', 'http://www.southsearattan.com/', 'https://www.coconisfurniture.com/',
    'http://www.superdealfurniture.com/', 'https://www.progressivefurniture.com/', 'http://www.potterybarnkids.ca/', 'https://www.progressivefurniture.com/', 'http://www.potterybarnkids.ca/', 'http://www.furnitureforpatio.com/', 'http://arts-classic.com/', 'https://www.cantoni.com/', 'https://www.bagoesteak.com/', 'http://www.furniturestoreplainfieldil.com/', 'https://www.vermontmadefurniture.com/', 'http://www.stockroom.com.hk/', 'http://usedfurnituregallery.com/', 'https://www.kingliving.com.au/', 'https://www.singaporefurniture.com/', 'http://www.proglobal-furniture.com/', 'http://htfurniture.en.alibaba.com/', 'http://newitemarrive.com/', 'http://www.proglobal-furniture.com/', 'http://htfurniture.en.alibaba.com/', 'https://www.katom.com/cat/furniture.html', 'http://leathercraft-furniture.com/', 'https://www.cultfurniture.com/', 'http://lindseyfurniture.com/', 'https://casefurniture.com/', 'https://www.furnitureprojects.co/', 'http://argofurnitureusa.com/', 'http://furniture-systems.com/', 'https://www.nfm.com/list.aspx?dsNav=N:0,Ntk:primary%7CTexas%20Store%7C1%7C,Ro:0', 'http://www.villainternational.com/', 'http://ccfinefurniture.com/', 'http://dmi-office-furniture.com/', 'http://valleyfurniture.net/', 'http://woodloft.com/', 'https://huataifurniture.en.alibaba.com/', 'https://www.clickonfurniture.com.au/', 'https://citizenshipper.com/shipping-furniture', 'https://thefurniturespecialist.com/', 'http://www.brianbracefinefurniture.com/', 'http://www.customcreationsfurniture.com/', 'http://coloradoconsignments.com/', 'http://www.ffi.msstate.edu/', 'http://sucasafurniture.net/', 'http://thebenefitstore.org/', 'http://www.chervan.com/', 'https://www.hertzfurniture.com/', 'https://www.tropitone.com/', 'http://kozykingdom.com/', 'http://strongproject.com/',
    'http://www.afrrental.com/', 'http://www.doorcountyfurniture.net/', 'https://www.beyondfurniture.com.au/', 'https://www.prnewswire.com/news-releases/rave-reviews-releases-ranking-of-the-best-outdoor-furniture-300806023.html', 'http://www.bargainfurnitures.com/', 'https://www.coricraft.co.za/', 'http://woodyou.com/', 'http://www.peglegstudio.com/', 'http://www.sterlingfurnitureslc.com/', 'http://www.myfurnitureliquidation.com/', 'http://paintedfurniturebarn.com/', 'http://www.chinese-furniture.com/', 'http://www.appalachiandesigns.com/', 'https://artgallery.yale.edu/furniture-study', 'https://www.lowes.ca/furniture/', 'https://www.scad.edu/academics/programs/furniture-design', 'https://www.furniturelibrary.com/', 'http://www.modern1furniture.com/', 'http://rossicustom.com/', 'http://www.furnitureworldsaskatoon.com/', 'http://www.lizz-furniture.com/', 'https://www.forbes.com/sites/forbes-finds/2019/03/01/the-10-best-places-online-to-shop-for-amazing-furniture/', 'https://www.forbes.com/sites/forbes-finds/2019/03/01/the-10-best-places-online-to-shop-for-amazing-furniture/', 'https://www.ibmhcorp.com/en/', 'http://westchesterwoodsfurniture.com/', 'http://westchesterwoodsfurniture.com/', 'http://www.townandcountryfurniturema.com/', 'http://www.furniturespecialtiesinc.com/', 'http://www.midcenturyfurniturewarehouse.com/', 'http://www.ofctampa.com/', 'https://www.marthastewart.com/275678/outdoor-furniture-care-guide', 'http://ruppfurniture.com/', 'http://www.restaurantfurnituresupply.com/', 'http://www.metmuseum.org/toah/hd/shak/hd_shak.htm', 'http://teakia.com/', 'https://cityfurnish.com/', 'http://www.pristinefurniturerepair.com/', 'http://www.furnituredoctor.net/', 'http://www.furniturefirst.coop/', 'https://www.wisanka.com/', 'http://www.universalupholstering.com/',
    'http://patiopvc.com/', 'http://www.whitelinemod.com/', 'https://inhabitat.com/design/furniture/', 'http://www.handcraftedfurniture.net/', 'http://www.leonfurniturestore.com/', 'http://www.space2.com/', 'http://liveniu.com/', 'http://www.brookingsfurniture.com/', 'http://arizonaroomstore.com/', 'http://burrsunfinishedfurniture.com/', 'http://www.bfionline.com/', 'http://www.nwfurniturebank.org/', 'http://walkerfurnituregainesville.com/', 'https://suncoastfurniture.com/', 'http://furnsoc.org/', 'http://specialtyfurniturerefinishing.net/', 'https://www.furnitureplustt.com/', 'http://www.aslfurniture.com/', 'http://www.oceansidefurniture.com/', 'http://www.furnituregalleryinc.com/', 'https://www.bathstore.com/products/bathroom-furniture', 'https://bifma.org/', 'http://www.furnitureprocorp.com/', 'http://ciaofurniture.en.alibaba.com/', 'http://woodschool.org/furniture-making-courses-programs/intensives/furniture-intensive', 'http://www.resources.com/mantemp.htm', 'http://www.cdgfurniture.com/', 'http://modernfurnitureclassics.com/', 'http://propertyfurniture.com/', 'http://www.induscraft.com/', 'http://www.starkwoodfurniture.com/', 'http://www.frankensteinfurniture.net/', 'http://www.woodschool.org/', 'https://www.costco.ca/furniture.html', 'https://www.costco.ca/NonAjaxAccountListDisplayView?listId=.', 'https://www.costco.ca/OrderStatusCmd?fromYear=2018&fromMonth=8&toYear=2019&toMonth=1', 'https://furnituredirectuk.net/', 'https://fmvegas.com/', 'http://pollaro.com/', 'http://www.ezmodfurniture.com/', 'https://www.indonesiateakwoodfurniture.com/', 'https://www.bedroomfurniturediscounts.com/', 'https://www.alibaba.com/showroom/bedroom-furniture.html', 'http://www.burressoak.com/', 'http://furnitureelevator.com/', 'http://clearlakefurniture.com/',
    'http://furnituredepotstore.com/', 'http://www.fowfurniture.com/', 'https://www.furniturenews.net/', 'https://floridapatio.net/', 'https://www.vetrafurniture.com/', 'http://lulusfurniture.com/', 'https://stores.cort.com/', 'http://furniturebankatlanta.org/', 'http://www.furniturefirm.com/', 'https://corporettemoms.com/how-to-pick-kid-friendly-furniture/', 'http://www.westelm.com.au/furniture-we-au', 'http://www.mfg-furniture.com/', 'https://office.cort.com/storefront/', 'http://mainstreetofficefurnitureutah.com/', 'http://warehousefurniturehsv.com/', 'http://www.ababy.com/', 'http://furnituredesigngallery.com/', 'http://2010officefurniture.com/', 'https://www.modernfurnishings.com/', 'https://www.furniturefetish.com.au/', 'http://www.watersongfurniture.com/', 'http://sustainablefurnishings.org/', 'http://www.glasspec.com/', 'http://northern-furniture.com/', 'https://www.missionrs.com/restaurant-furniture', 'https://shopping.yahoo.com/furniture/', 'http://northern-furniture.com/', 'https://ladiscountfurniture.com/', 'https://www.temafurniture.com/', 'http://www.riseonly.com/', 'https://www.snapdeal.com/products/furniture-living-room', 'https://www.snapdeal.com/products/furniture', 'http://justofficefurniture.com/', 'http://thebeanbagstore.com/', 'http://www.greendesigns.com/', 'http://www.mobelhomestore.com/', 'https://www.furniturenation.com/bedrooms', 'http://www.lanzafame.com/', 'http://www.corbin.com/furniture/', 'http://www.corbin.com/furniture/', 'http://behrsfurniture.com/', 'http://www.mennonite-furniture-studios.com/', 'https://www.melbourniansfurniture.com.au/', 'https://republicfurnitures.com/', 'http://www.uniquefurniture.com/', 'http://corpfurnitureleasing.com/', 'https://jeparacrafterfurniture.com/', 'http://www.furniture-rental-tokyo.com/',
    'http://www.rattanland.com/', 'http://www.indianfurnitureoutlet.com/', 'https://www.bobmillsfurniture.com/lubbock.inc', 'http://furnitureoutletplace.com/', 'http://beautifulrooms.net/', 'http://beautifulrooms.net/'];

console.log('总共地址数量：' + list.length);
// let count = 0;
// queue.on('active', () => {
//     console.log(`Working on item #${++count}.  Size: ${queue.size}  Pending: ${queue.pending}`);
// });
//
// let num = 0;
// let allList = [];

// list.forEach(function (url, idx) {
//
//
//     queue.add(function () {
//         return delay(1000 * idx).then(function () {
//             return crawl(url, null);
//         });
//     }).then(function (data) {
//         let allEmailArray = data.allEmailArray;
//         let haoShi = data.haoShi;
//         if (allEmailArray.length) {
//             console.log('============');
//             console.log(url);
//             console.log(allEmailArray);
//             console.log(haoShi);
//         }
//         allList.push(data);
//         num++;
//     });
// //
// //     console.log(`3. Queue size: ${queue.size}`);
// // //=> '3. Queue size: 1`
// //     console.log(`4. Pending promises: ${queue.pending}`);
// });

//
// //=> '4. Pending promises: 1'
//
// queue.onIdle().then(() => {
//     console.log('12. All work is done');
//     console.log('获取到邮箱的网址数量:' + num);
//     allList.forEach(function (d) {
//         console.log(d);
//     })
//
// });
//
// queue.onEmpty().then(() => {
//     console.log('7. Queue is empty');
// });

export function startTest() {
    // queue.start();
    // list.forEach(function (url, idx) {
    for (var idx = 0; idx < list.length; idx++) {
        let url = list[idx];

        setTimeout(function () {
            crawl2(url, null, function (data) {
                let allEmailArray = data.allEmailArray;
                let haoShi = data.haoShi;
                if (allEmailArray.length) {
                    console.log('============');
                    console.log(url);
                    console.log(allEmailArray);
                    console.log(haoShi);
                }
                // allList.push(data);
                // num++;
                // global.gc();
                console.log('内存：' + process.memoryUsage().heapUsed);
                data = null;
            });

        }, 1000 * idx);
    }
    // delay(1000 * idx).then(function () {
    //     return crawl(url, null);
    // }).then(function (data) {
    //     let allEmailArray = data.allEmailArray;
    //     let haoShi = data.haoShi;
    //     if (allEmailArray.length) {
    //         console.log('============');
    //         console.log(url);
    //         console.log(allEmailArray);
    //         console.log(haoShi);
    //     }
    //     allList.push(data);
    //     num++;
    // });
    // });
};
