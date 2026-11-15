package com.marketnest.config;

import com.marketnest.entity.*;
import com.marketnest.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductCategoryRepository categoryRepository;

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private UsedProductListingRepository usedProductRepository;

    @Autowired
    private NewProductRepository newProductRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductBrandRepository productBrandRepository;

    @Autowired
    private MarketplaceOfferRepository marketplaceOfferRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Already initialized
        }

        System.out.println(">>> Initializing MarketNest Seed Data for Production...");

        // 1. Seed Core Users
        String encodedPass = passwordEncoder.encode("password123");

        User admin = new User("Vikram Singhania (Admin)", "admin@marketnest.com", encodedPass, Role.ADMIN, "+91 98000 00001", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80");
        User seller = new User("Arjun Mehta (Seller)", "seller@marketnest.com", encodedPass, Role.SELLER, "+91 98450 12345", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80");
        User shopOwner = new User("Rajesh Kulkarni (Shop Partner)", "shop@marketnest.com", encodedPass, Role.SHOP_OWNER, "+91 99002 99881", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80");
        User customer = new User("Pooja Sharma (Shopper)", "customer@marketnest.com", encodedPass, Role.CUSTOMER, "+91 98765 43210", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80");

        userRepository.save(admin);
        userRepository.save(seller);
        userRepository.save(shopOwner);
        userRepository.save(customer);

        // 2. Seed 14 Categories
        String[][] categoriesData = {
            {"Smartphones", "smartphones", "Smartphone", "iPhones, Samsung Galaxy, Pixel & flagship devices", "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80", "142"},
            {"Laptops", "laptops", "Laptop", "MacBooks, gaming laptops, ultrabooks & workstations", "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80", "98"},
            {"Smartwatches", "smartwatches", "Watch", "Apple Watch, Galaxy Watch & fitness bands", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80", "64"},
            {"Tablets", "tablets", "Tablet", "iPad Pro, Air, Galaxy Tab & graphic pads", "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80", "51"},
            {"Headphones", "headphones", "Headphones", "Sony, Bose, AirPods Pro & audiophile gear", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80", "87"},
            {"Cameras", "cameras", "Camera", "Sony Alpha, Canon EOS, Nikon & cinema lenses", "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80", "43"},
            {"Televisions", "televisions", "Tv", "4K OLED, QLED, Smart TVs & soundbars", "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80", "39"},
            {"Gaming Devices", "gaming-devices", "Gamepad2", "PlayStation 5, Xbox Series X & Nintendo Switch", "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80", "76"},
            {"Motorcycles", "motorcycles", "Bike", "Cruisers, sports bikes & electric scooters", "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80", "28"},
            {"Bicycles", "bicycles", "Milestone", "Road bikes, MTBs, gravel & hybrid cycles", "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80", "35"},
            {"Refrigerators", "refrigerators", "Refrigerator", "Double door, side-by-side & smart inverters", "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=600&q=80", "32"},
            {"Washing Machines", "washing-machines", "Waves", "Front-load, top-load & washer dryers", "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80", "29"},
            {"Kitchen Appliances", "kitchen-appliances", "Microwave", "Air fryers, espresso machines & ovens", "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80", "61"},
            {"Furniture", "furniture", "Armchair", "Ergonomic desks, recliners & wooden sofas", "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80", "53"}
        };

        for (String[] cat : categoriesData) {
            categoryRepository.save(new ProductCategory(cat[0], cat[1], cat[2], cat[3], cat[4], Integer.parseInt(cat[5])));
        }

        // 3. Seed Registered Shops (Bengaluru Metro GPS coordinates)
        Shop shop1 = new Shop();
        shop1.setName("iWorld Authorized Apple Reseller");
        shop1.setCategory("Electronics & Computers");
        shop1.setDescription("Official Apple Premium Partner offering Mac, iPad, iPhone, Apple Watch and genuine accessories.");
        shop1.setAddress("Plot 402, 100 Feet Road, HAL 2nd Stage, Indiranagar");
        shop1.setCity("Bengaluru");
        shop1.setZipCode("560038");
        shop1.setLatitude(12.9719);
        shop1.setLongitude(77.6412);
        shop1.setPhone("+91 80 4123 4567");
        shop1.setEmail("indiranagar@iworld.in");
        shop1.setRating(4.9);
        shop1.setReviewsCount(312);
        shop1.setOpeningHours("10:00 AM – 09:30 PM (Mon-Sun)");
        shop1.setIsVerified(true);
        shop1.setImageUrl("https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80");
        shop1.setOwner(shopOwner);
        shopRepository.save(shop1);

        Shop shop2 = new Shop();
        shop2.setName("Galaxy Hub Exclusive Store");
        shop2.setCategory("Smartphones & Gadgets");
        shop2.setDescription("Flagship Samsung experience centre with live device zones, exchange bonuses, trade-in valuations.");
        shop2.setAddress("80 Feet Road, 4th Block, Koramangala");
        shop2.setCity("Bengaluru");
        shop2.setZipCode("560034");
        shop2.setLatitude(12.9352);
        shop2.setLongitude(77.6245);
        shop2.setPhone("+91 80 4987 6543");
        shop2.setEmail("koramangala@galaxyhub.com");
        shop2.setRating(4.8);
        shop2.setReviewsCount(245);
        shop2.setOpeningHours("10:30 AM – 09:00 PM (Mon-Sun)");
        shop2.setIsVerified(true);
        shop2.setImageUrl("https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80");
        shop2.setOwner(shopOwner);
        shopRepository.save(shop2);

        Shop shop3 = new Shop();
        shop3.setName("Metro Electronics Flagship Superstore");
        shop3.setCategory("Home Appliances & TVs");
        shop3.setDescription("Over 10,000 sq ft showroom showcasing top home appliances, 4K OLED televisions, audio soundbars, washing machines.");
        shop3.setAddress("Nexus Mall Ground Floor, Hosur Road, Koramangala");
        shop3.setCity("Bengaluru");
        shop3.setZipCode("560095");
        shop3.setLatitude(12.9329);
        shop3.setLongitude(77.6143);
        shop3.setPhone("+91 80 2555 8899");
        shop3.setEmail("support@metroelectronics.in");
        shop3.setRating(4.7);
        shop3.setReviewsCount(520);
        shop3.setOpeningHours("10:00 AM – 10:00 PM (All Days)");
        shop3.setIsVerified(true);
        shop3.setImageUrl("https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80");
        shop3.setOwner(shopOwner);
        shopRepository.save(shop3);

        // 4. Seed Used Products
        UsedProductListing p1 = new UsedProductListing();
        p1.setTitle("Apple iPhone 14 Pro Max 256GB - Space Black");
        p1.setDescription("Immaculate condition iPhone 14 Pro Max. Battery health is at 94%. Includes original box, braided lightning cable and bill.");
        p1.setCategory("Smartphones");
        p1.setBrand("Apple");
        p1.setModel("iPhone 14 Pro Max");
        p1.setSellingPrice(78500.0);
        p1.setOriginalPrice(139900.0);
        p1.setCondition(ProductCondition.EXCELLENT);
        p1.setProductAgeMonths(14);
        p1.setWarrantyStatus(false);
        p1.setAccessories("Original Box, Fast Charger Cable, Spigen Case");
        p1.setImages("https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80");
        p1.setLocation("Indiranagar 100ft Road");
        p1.setCity("Bengaluru");
        p1.setSeller(seller);
        p1.setSellerName("Arjun Mehta");
        p1.setSellerRating(4.9);
        p1.setSellerReviewsCount(18);
        p1.setSellerPhone("+91 98450 12345");
        p1.setStatus(ListingStatus.ACTIVE);
        p1.setFeatured(true);
        usedProductRepository.save(p1);

        UsedProductListing p2 = new UsedProductListing();
        p2.setTitle("MacBook Pro 14\" M2 Pro (16GB RAM / 512GB SSD)");
        p2.setDescription("Space Gray MacBook Pro 14 inch in Like-New condition. Barely used 22 battery cycle count. No scratches or dents.");
        p2.setCategory("Laptops");
        p2.setBrand("Apple");
        p2.setModel("MacBook Pro 14 M2 Pro");
        p2.setSellingPrice(124000.0);
        p2.setOriginalPrice(199900.0);
        p2.setCondition(ProductCondition.LIKE_NEW);
        p2.setProductAgeMonths(8);
        p2.setWarrantyStatus(true);
        p2.setAccessories("67W MagSafe Adapter, Original Box, Incase Sleeve");
        p2.setImages("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80");
        p2.setLocation("Koramangala 4th Block");
        p2.setCity("Bengaluru");
        p2.setSeller(seller);
        p2.setSellerName("Priya Sundaram");
        p2.setSellerRating(5.0);
        p2.setSellerReviewsCount(31);
        p2.setSellerPhone("+91 99801 88765");
        p2.setStatus(ListingStatus.ACTIVE);
        p2.setFeatured(true);
        usedProductRepository.save(p2);

        UsedProductListing p3 = new UsedProductListing();
        p3.setTitle("Sony PlayStation 5 Disc Edition + 2 DualSense Controllers");
        p3.setDescription("PS5 Disc Console in pristine state. Comes with two controllers (White & Midnight Black), God of War Ragnarok disc, and HDMI 2.1 cable.");
        p3.setCategory("Gaming Devices");
        p3.setBrand("Sony");
        p3.setModel("PlayStation 5 Disc Edition");
        p3.setSellingPrice(38000.0);
        p3.setOriginalPrice(54990.0);
        p3.setCondition(ProductCondition.EXCELLENT);
        p3.setProductAgeMonths(11);
        p3.setWarrantyStatus(true);
        p3.setAccessories("2 DualSense Controllers, God of War Ragnarok, HDMI 2.1 Cable, Box");
        p3.setImages("https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80");
        p3.setLocation("HSR Layout Sector 2");
        p3.setCity("Bengaluru");
        p3.setSeller(seller);
        p3.setSellerName("Rohan Deshmukh");
        p3.setSellerRating(4.8);
        p3.setSellerReviewsCount(14);
        p3.setSellerPhone("+91 98860 34120");
        p3.setStatus(ListingStatus.ACTIVE);
        p3.setFeatured(true);
        usedProductRepository.save(p3);

        // 5. Seed New Retail Products
        NewProduct np1 = new NewProduct();
        np1.setTitle("Apple MacBook Air 15\" M3 Chip (16GB RAM / 512GB SSD)");
        np1.setDescription("Supercharged by the next-generation M3 chip. Impossibly thin, ultra-light, with up to 18 hours of battery life and Liquid Retina display.");
        np1.setCategory("Laptops");
        np1.setBrand("Apple");
        np1.setModel("MacBook Air 15 M3");
        np1.setPrice(134900.0);
        np1.setOriginalPrice(154900.0);
        np1.setDiscountPercentage(13);
        np1.setStockQuantity(18);
        np1.setShop(shop1);
        np1.setShopName(shop1.getName());
        np1.setShopVerified(true);
        np1.setImages("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80");
        np1.setSpecifications("Processor: Apple M3 (8-core CPU / 10-core GPU); RAM: 16GB Unified Memory; Storage: 512GB Ultrafast SSD; Display: 15.3-inch Liquid Retina with True Tone");
        np1.setRating(4.9);
        np1.setReviewsCount(42);
        np1.setIsAvailable(true);
        np1.setWarrantyPeriod("1 Year Apple Official Warranty");
        newProductRepository.save(np1);

        NewProduct np2 = new NewProduct();
        np2.setTitle("Samsung Galaxy S24 Ultra 5G (12GB RAM / 256GB Titanium Gray)");
        np2.setDescription("Welcome to the era of Galaxy AI. Titanium frame, built-in S Pen, 200MP camera system with 100x Space Zoom, and Snapdragon 8 Gen 3.");
        np2.setCategory("Smartphones");
        np2.setBrand("Samsung");
        np2.setModel("Galaxy S24 Ultra");
        np2.setPrice(119999.0);
        np2.setOriginalPrice(134999.0);
        np2.setDiscountPercentage(11);
        np2.setStockQuantity(24);
        np2.setShop(shop2);
        np2.setShopName(shop2.getName());
        np2.setShopVerified(true);
        np2.setImages("https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80");
        np2.setSpecifications("Processor: Snapdragon 8 Gen 3; Camera: 200MP Quad Camera; Display: 6.8 Dynamic AMOLED 2X 120Hz; Battery: 5000 mAh");
        np2.setRating(4.8);
        np2.setReviewsCount(68);
        np2.setIsAvailable(true);
        np2.setWarrantyPeriod("1 Year Brand Warranty + Screen Protection");
        newProductRepository.save(np2);

        // 6. Seed Complete Module 1 Electronics Catalog, Brands & Marketplace Comparison Offers
        seedCatalogProductsAndOffers();

        System.out.println(">>> MarketNest Seed Data Initialization Complete!");
    }

    private void seedCatalogProductsAndOffers() {
        if (productRepository.count() > 0) return;

        // Seed Brands across the 11 categories
        String[][] brandsData = {
            // Smartphones
            {"Apple", "smartphones", "Smartphones"}, {"Samsung", "smartphones", "Smartphones"},
            {"OnePlus", "smartphones", "Smartphones"}, {"Xiaomi", "smartphones", "Smartphones"},
            {"Redmi", "smartphones", "Smartphones"}, {"Realme", "smartphones", "Smartphones"},
            {"Vivo", "smartphones", "Smartphones"}, {"Oppo", "smartphones", "Smartphones"},
            {"Motorola", "smartphones", "Smartphones"}, {"Google Pixel", "smartphones", "Smartphones"},
            {"Nothing", "smartphones", "Smartphones"}, {"iQOO", "smartphones", "Smartphones"},

            // Laptops & Computers
            {"Apple", "laptops", "Laptops & Computers"}, {"HP", "laptops", "Laptops & Computers"},
            {"Dell", "laptops", "Laptops & Computers"}, {"Lenovo", "laptops", "Laptops & Computers"},
            {"Asus", "laptops", "Laptops & Computers"}, {"Acer", "laptops", "Laptops & Computers"},
            {"MSI", "laptops", "Laptops & Computers"},

            // Smartwatches
            {"Apple", "smartwatches", "Smartwatches & Wearables"}, {"Samsung", "smartwatches", "Smartwatches & Wearables"},
            {"Noise", "smartwatches", "Smartwatches & Wearables"}, {"Fire-Boltt", "smartwatches", "Smartwatches & Wearables"},
            {"boAt", "smartwatches", "Smartwatches & Wearables"}, {"Garmin", "smartwatches", "Smartwatches & Wearables"},

            // Audio
            {"Sony", "audio", "Audio Products"}, {"Apple", "audio", "Audio Products"},
            {"boAt", "audio", "Audio Products"}, {"Bose", "audio", "Audio Products"},
            {"JBL", "audio", "Audio Products"}, {"Sennheiser", "audio", "Audio Products"},
            {"OnePlus", "audio", "Audio Products"},

            // Televisions & Entertainment
            {"Samsung", "televisions", "Televisions & Entertainment"}, {"LG", "televisions", "Televisions & Entertainment"},
            {"Sony", "televisions", "Televisions & Entertainment"}, {"Xiaomi", "televisions", "Televisions & Entertainment"},
            {"TCL", "televisions", "Televisions & Entertainment"},

            // Cameras
            {"Canon", "cameras", "Cameras"}, {"Sony", "cameras", "Cameras"},
            {"Nikon", "cameras", "Cameras"}, {"GoPro", "cameras", "Cameras"},
            {"DJI", "cameras", "Cameras"},

            // Tablets
            {"Apple", "tablets", "Tablets"}, {"Samsung", "tablets", "Tablets"},
            {"Lenovo", "tablets", "Tablets"},

            // Home Appliances
            {"LG", "home-appliances", "Home Electrical Appliances"}, {"Samsung", "home-appliances", "Home Electrical Appliances"},
            {"Whirlpool", "home-appliances", "Home Electrical Appliances"}, {"Voltas", "home-appliances", "Home Electrical Appliances"},
            {"Dyson", "home-appliances", "Home Electrical Appliances"},

            // Kitchen Appliances
            {"Philips", "kitchen-appliances", "Kitchen Electrical Appliances"}, {"Prestige", "kitchen-appliances", "Kitchen Electrical Appliances"},
            {"De'Longhi", "kitchen-appliances", "Kitchen Electrical Appliances"}, {"Morphy Richards", "kitchen-appliances", "Kitchen Electrical Appliances"},

            // Gaming
            {"Sony PlayStation", "gaming", "Gaming"}, {"Microsoft Xbox", "gaming", "Gaming"},
            {"Nintendo", "gaming", "Gaming"}, {"Logitech G", "gaming", "Gaming"},
            {"Razer", "gaming", "Gaming"},

            // Other Electronics
            {"Canon", "other-electronics", "Other Electronics"}, {"HP", "other-electronics", "Other Electronics"},
            {"SanDisk", "other-electronics", "Other Electronics"}, {"TP-Link", "other-electronics", "Other Electronics"}
        };

        for (String[] b : brandsData) {
            productBrandRepository.save(new ProductBrand(b[0], b[1], b[2], null));
        }

        // Seed Canonical Catalog Products and comparison pairs
        // 1. Apple iPhone 15
        saveProductWithOffers(
            "APL-IP15-128", "Apple iPhone 15 (128GB Storage)", "Apple", "iPhone 15", "Smartphones", "Smartphones",
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
            "128GB Storage, 6GB RAM", 79900.0,
            "A16 Bionic chip, 48MP Main Camera, Super Retina XDR OLED display, Dynamic Island, USB-C connectivity.",
            "B0CHX1W1XY", "Apple iPhone 15 (128 GB) - Black", "https://www.amazon.in/dp/B0CHX1W1XY", 65999.0, 79900.0, 17, 4.6, 8420,
            "MOBGTAGPA3HSF5H6", "Apple iPhone 15 (Black, 128 GB)", "https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itm6ac6485515ae4", 64999.0, 79900.0, 18, 4.6, 12430
        );

        // 2. Samsung Galaxy S24
        saveProductWithOffers(
            "SAM-GS24-128", "Samsung Galaxy S24 5G (8GB RAM, 128GB Storage)", "Samsung", "Galaxy S24", "Smartphones", "Smartphones",
            "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
            "8GB RAM, 128GB Storage", 79999.0,
            "Galaxy AI Suite, Exynos 2400 / Snapdragon 8 Gen 3, 50MP Triple Camera with 30x Space Zoom, 4000mAh Battery.",
            "B0CS5X6F8Q", "Samsung Galaxy S24 5G (Onyx Black, 8GB, 128GB Storage)", "https://www.amazon.in/dp/B0CS5X6F8Q", 64999.0, 79999.0, 19, 4.5, 4120,
            "MOBGWU8F6GYFPHR7", "SAMSUNG Galaxy S24 5G (Onyx Black, 128 GB, 8 GB RAM)", "https://www.flipkart.com/samsung-galaxy-s24-5g-onyx-black-128-gb/p/itm3d79b28b7a4cf", 63999.0, 79999.0, 20, 4.5, 6210
        );

        // 3. Samsung Galaxy S24 Ultra
        saveProductWithOffers(
            "SAM-GS24U-256", "Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB Storage)", "Samsung", "Galaxy S24 Ultra", "Smartphones", "Smartphones",
            "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80",
            "12GB RAM, 256GB Storage", 134999.0,
            "Titanium chassis, built-in S Pen, 200MP Quad Telephoto Camera, 100x Space Zoom, Snapdragon 8 Gen 3 for Galaxy.",
            "B0CS5Y29Z1", "Samsung Galaxy S24 Ultra 5G (Titanium Gray, 12GB, 256GB Storage)", "https://www.amazon.in/dp/B0CS5Y29Z1", 121999.0, 134999.0, 10, 4.7, 5840,
            "MOBGWU8FKRHKN6FZ", "SAMSUNG Galaxy S24 Ultra 5G (Titanium Gray, 256 GB, 12 GB RAM)", "https://www.flipkart.com/samsung-galaxy-s24-ultra-5g-titanium-gray-256-gb/p/itmd5bdfaa09b301", 121499.0, 134999.0, 10, 4.7, 7810
        );

        // 4. OnePlus 12
        saveProductWithOffers(
            "OP-12-256", "OnePlus 12 5G (12GB RAM, 256GB Storage)", "OnePlus", "OnePlus 12", "Smartphones", "Smartphones",
            "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
            "12GB RAM, 256GB Storage", 69999.0,
            "4th Gen Hasselblad Camera System, Snapdragon 8 Gen 3, 5400mAh Battery with 100W SUPERVOOC and 50W Wireless Charging.",
            "B0CSB4553N", "OnePlus 12 (Silky Black, 12GB RAM, 256GB Storage)", "https://www.amazon.in/dp/B0CSB4553N", 64999.0, 69999.0, 7, 4.4, 3890,
            "MOBGZ4Z5CYSFZ5ZZ", "OnePlus 12 (Silky Black, 256 GB, 12 GB RAM)", "https://www.flipkart.com/oneplus-12-silky-black-256-gb/p/itm5bca0a3384232", 64499.0, 69999.0, 7, 4.5, 4520
        );

        // 5. Apple MacBook Air M3
        saveProductWithOffers(
            "APL-MBA-M3-512", "Apple MacBook Air 13″ Laptop (M3 chip, 16GB RAM, 512GB SSD)", "Apple", "MacBook Air M3", "Laptops & Computers", "Laptops",
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
            "16GB Unified Memory, 512GB SSD", 134900.0,
            "Apple M3 8-core CPU, 10-core GPU, 13.6″ Liquid Retina display, MagSafe charging, 18 hours battery life.",
            "B0CX23V2ZH", "Apple MacBook Air 13″ Laptop with M3 chip (16GB, 512GB SSD)", "https://www.amazon.in/dp/B0CX23V2ZH", 124900.0, 134900.0, 7, 4.8, 1450,
            "COMGYZF3GZF77ZZ5", "Apple 2024 MacBook Air M3 (16 GB, 512 GB SSD, macOS)", "https://www.flipkart.com/apple-2024-macbook-air-m3-16-gb-512-gb-ssd/p/itmd2fc33db8db36", 123990.0, 134900.0, 8, 4.8, 1890
        );

        // 6. Lenovo LOQ Gaming Laptop
        saveProductWithOffers(
            "LEN-LOQ-RTX4050", "Lenovo LOQ AI Powered Gaming Laptop (Intel i5, RTX 4050)", "Lenovo", "LOQ Gaming", "Laptops & Computers", "Gaming laptops",
            "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80",
            "16GB DDR5, 512GB SSD, RTX 4050 6GB", 102990.0,
            "Intel Core i5 12th Gen 12450HX, 15.6″ FHD 144Hz 100% sRGB, NVIDIA GeForce RTX 4050 6GB GDDR6, LA1 AI chip.",
            "B0CR1W9M6Q", "Lenovo LOQ AI Powered Gaming Laptop (15.6″ FHD 144Hz, RTX 4050)", "https://www.amazon.in/dp/B0CR1W9M6Q", 74990.0, 102990.0, 27, 4.4, 1870,
            "COMGZ7FH0X5O8WZZ", "Lenovo LOQ Intel Core i5 12th Gen 12450HX RTX 4050", "https://www.flipkart.com/lenovo-loq-intel-core-i5-12th-gen-12450hx/p/itm28bca0a338499", 73990.0, 102990.0, 28, 4.4, 2190
        );

        // 7. Apple Watch Series 9
        saveProductWithOffers(
            "APL-AWS9-45", "Apple Watch Series 9 GPS 45mm Midnight Aluminium", "Apple", "Watch Series 9", "Smartwatches & Wearables", "Smartwatches",
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
            "45mm Midnight Aluminium Case, Sport Band", 44900.0,
            "S9 SiP chip, Double tap gesture, 2000 nits brighter Always-On Retina display, Blood Oxygen & ECG apps.",
            "B0CHX37H8Z", "Apple Watch Series 9 GPS 45mm Midnight Aluminium Case", "https://www.amazon.in/dp/B0CHX37H8Z", 41999.0, 44900.0, 6, 4.7, 2390,
            "SMWGTAGP8ZZZZZ11", "Apple Watch Series 9 GPS 45mm Midnight Aluminium Case", "https://www.flipkart.com/apple-watch-series-9-gps-45mm/p/itm08bca0a338477", 41499.0, 44900.0, 7, 4.7, 3120
        );

        // 8. Sony WH-1000XM5 Headphones
        saveProductWithOffers(
            "SNY-XM5-BLK", "Sony WH-1000XM5 Noise Cancelling Wireless Headphones", "Sony", "WH-1000XM5", "Audio Products", "Headphones",
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
            "Over-Ear, Active Noise Cancelling", 34990.0,
            "Industry Leading Noise Cancellation with 8 microphones & Auto NC Optimizer, 30-hour battery life, Multipoint.",
            "B09XS7JWHH", "Sony WH-1000XM5 Wireless Industry Leading Noise Cancelling Headphones", "https://www.amazon.in/dp/B09XS7JWHH", 28990.0, 34990.0, 17, 4.6, 6890,
            "ACCGTAGP4VVVVV55", "SONY WH-1000XM5 Bluetooth Headset with Active Noise Cancellation", "https://www.flipkart.com/sony-wh-1000xm5-bluetooth-headset/p/itm68bca0a338433", 28490.0, 34990.0, 18, 4.6, 8450
        );

        // 9. Apple AirPods Pro (2nd Gen)
        saveProductWithOffers(
            "APL-APP2-USBC", "Apple AirPods Pro (2nd Generation) with MagSafe Case (USB-C)", "Apple", "AirPods Pro 2", "Audio Products", "TWS earbuds",
            "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80",
            "USB-C Charging Case, Active Noise Cancellation", 24900.0,
            "H2 chip, Up to 2x more Active Noise Cancellation, Adaptive Audio, Transparency mode, Personalized Spatial Audio.",
            "B0BDHWDR12", "Apple AirPods Pro (2nd Generation) with MagSafe Case (USB-C)", "https://www.amazon.in/dp/B0BDHWDR12", 21999.0, 24900.0, 12, 4.7, 9840,
            "ACCGTAGP3UUUUU66", "Apple AirPods Pro (2nd generation) with MagSafe Case (USB-C)", "https://www.flipkart.com/apple-airpods-pro-2nd-generation-magsafe-case/p/itm58bca0a338422", 21499.0, 24900.0, 13, 4.7, 14200
        );

        // 10. Sony PlayStation 5 Console
        saveProductWithOffers(
            "SNY-PS5-SLIM", "Sony PlayStation 5 Console (Slim Disc Edition)", "Sony PlayStation", "PlayStation 5", "Gaming", "Gaming consoles",
            "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80",
            "1TB Ultra-High Speed SSD, 4K Blu-ray Disc Drive", 54990.0,
            "Harness custom CPU, GPU, and SSD with Integrated I/O. Tempest 3D AudioTech, Ray Tracing, 120fps with 120Hz output.",
            "B0CLV267K6", "Sony PlayStation 5 Console (slim disc edition)", "https://www.amazon.in/dp/B0CLV267K6", 54990.0, 54990.0, 0, 4.8, 4820,
            "GAMGTAGP1IIIII88", "SONY PlayStation 5 (Slim) 1 TB (White)", "https://www.flipkart.com/sony-playstation-5-slim-1-tb/p/itm38bca0a338300", 54490.0, 54990.0, 1, 4.8, 6120
        );

        // 11. Samsung Crystal 4K Vivid 55" TV
        saveProductWithOffers(
            "SAM-TV55-4K", "Samsung Crystal 4K Vivid 138 cm (55 inch) Ultra HD Smart LED TV", "Samsung", "Crystal 4K Vivid 55", "Televisions & Entertainment", "Smart TVs",
            "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80",
            "55 inch 4K Ultra HD, 50Hz, PurColor", 64900.0,
            "Crystal Processor 4K, 4K Upscaling, OTS Lite sound, HDR 10+, Q-Symphony, Motion Xcelerator.",
            "B0CQY4G9KL", "Samsung 138 cm (55 inches) 4K Ultra HD Smart LED TV (Crystal 4K Vivid)", "https://www.amazon.in/dp/B0CQY4G9KL", 42990.0, 64900.0, 34, 4.4, 5230,
            "TVEGTAGP0RRRRR99", "SAMSUNG Crystal 4K Vivid 138 cm (55 inch) Ultra HD (4K) LED Smart TV", "https://www.flipkart.com/samsung-crystal-4k-vivid-138-cm-55-inch-ultra-hd-4k-led-smart-tv/p/itm28bca0a338399", 42490.0, 64900.0, 34, 4.4, 7120
        );

        // 12. Sony Alpha ILCE-7M4 Mirrorless Camera
        saveProductWithOffers(
            "SNY-A7M4-BODY", "Sony Alpha ILCE-7M4 Full-Frame 33MP Mirrorless Camera", "Sony", "Alpha ILCE-7M4", "Cameras", "Mirrorless cameras",
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
            "33MP Full-Frame Exmor R CMOS Sensor, 4K 60p", 242490.0,
            "BIONZ XR image processing engine, Real-time Eye AF (human, animal, bird), 10 fps continuous shooting.",
            "B08L5TNVJ7", "Sony Alpha ILCE-7M4 Full-Frame Hybrid Camera 33MP Mirrorless", "https://www.amazon.in/dp/B08L5TNVJ7", 209990.0, 242490.0, 13, 4.7, 780,
            "CAMGTAGP7OOOOO22", "SONY Alpha ILCE-7M4 Mirrorless Camera Body Only", "https://www.flipkart.com/sony-alpha-ilce-7m4-mirrorless-camera/p/itm98bca0a338366", 208990.0, 242490.0, 13, 4.7, 980
        );

        // 13. Apple iPad Air 11″ M2
        saveProductWithOffers(
            "APL-IPADAIR-M2", "Apple iPad Air 11″ (M2 chip, Liquid Retina, 128GB, Wi-Fi)", "Apple", "iPad Air M2", "Tablets", "Apple iPad",
            "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
            "128GB Storage, Space Gray, Wi-Fi 6E", 59900.0,
            "Apple M2 chip, 11-inch Liquid Retina display with P3 wide color, 12MP Landscape Center Stage camera.",
            "B0D3JN8QZM", "Apple iPad Air 11″ (M2): Liquid Retina Display, 128GB, Wi-Fi 6E", "https://www.amazon.in/dp/B0D3JN8QZM", 57900.0, 59900.0, 3, 4.7, 1340,
            "TABGTAGP5MMMMM44", "Apple iPad Air (5th Gen) 64 GB ROM 10.9 Inch with Wi-Fi Only", "https://www.flipkart.com/apple-ipad-air-5th-gen-64-gb-rom-10-9-inch-wi-fi-only/p/itm78bca0a338344", 53999.0, 59900.0, 9, 4.7, 2410
        );

        // 14. LG 655L Side-by-Side Refrigerator
        saveProductWithOffers(
            "LG-REF-655L", "LG 655 L Frost-Free Smart Inverter Side-by-Side Refrigerator", "LG", "655L Frost-Free Refrigerator", "Home Electrical Appliances", "Refrigerators",
            "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=800&q=80",
            "655 Litres, Multi Air Flow, Smart ThinQ WiFi", 114990.0,
            "Smart Inverter Compressor, Door Cooling+, Express Freeze, Multi Digital Sensors, Deodorizer.",
            "B09Q5X23MN", "LG 655 L Frost-Free Inverter Side-by-Side Refrigerator", "https://www.amazon.in/dp/B09Q5X23MN", 72990.0, 114990.0, 37, 4.3, 1180,
            "REFGTAGP3KKKKK66", "LG 655 L Frost Free Side by Side Refrigerator (Shiny Steel)", "https://www.flipkart.com/lg-655-l-frost-free-side-refrigerator/p/itm58bca0a338322", 72490.0, 114990.0, 36, 4.3, 1450
        );

        // 15. Philips Digital Air Fryer HD9252/90
        saveProductWithOffers(
            "PHL-AF-HD9252", "Philips Digital Air Fryer HD9252/90 (Touch Panel, 4.1L)", "Philips", "Digital Air Fryer HD9252", "Kitchen Electrical Appliances", "Air fryers",
            "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
            "4.1 Litres, 1400W Rapid Air Technology", 11995.0,
            "Rapid Air Technology for 90% less fat, Touch screen with 7 presets, Keep warm function, Dishwasher safe.",
            "B08F7J4MN6", "Philips Digital Air Fryer HD9252/90 with Touch Panel 4.1L", "https://www.amazon.in/dp/B08F7J4MN6", 7999.0, 11995.0, 33, 4.4, 18900,
            "KITGTAGP2JJJJJ77", "PHILIPS HD9252/90 Air Fryer (4.1 L, Rapid Air Technology)", "https://www.flipkart.com/philips-hd9252-90-air-fryer/p/itm48bca0a338311", 7899.0, 11995.0, 34, 4.4, 21500
        );
    }

    private void saveProductWithOffers(
            String identifier, String title, String brand, String model, String category, String subcategory,
            String imageUrl, String variant, Double originalMrp, String specifications,
            String amzAsin, String amzTitle, String amzUrl, Double amzPrice, Double amzMrp, int amzDisc, double amzRating, int amzReviews,
            String fkFsn, String fkTitle, String fkUrl, Double fkPrice, Double fkMrp, int fkDisc, double fkRating, int fkReviews) {

        Product p = new Product(identifier, title, brand, model, category, subcategory, imageUrl, variant, originalMrp, specifications);
        Product saved = productRepository.save(p);

        MarketplaceOffer amzOffer = new MarketplaceOffer(
                saved.getId(), ProductSource.AMAZON, amzAsin, amzTitle, amzUrl,
                amzPrice, amzMrp, amzDisc, true, "In Stock", amzRating, amzReviews, false
        );
        marketplaceOfferRepository.save(amzOffer);

        MarketplaceOffer fkOffer = new MarketplaceOffer(
                saved.getId(), ProductSource.FLIPKART, fkFsn, fkTitle, fkUrl,
                fkPrice, fkMrp, fkDisc, true, "In Stock", fkRating, fkReviews, false
        );
        marketplaceOfferRepository.save(fkOffer);
    }
}

