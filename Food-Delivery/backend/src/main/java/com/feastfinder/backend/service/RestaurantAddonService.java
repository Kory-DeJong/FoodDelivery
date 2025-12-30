package com.feastfinder.backend.service;

import com.feastfinder.backend.dto.ToppingOption;
import com.feastfinder.backend.model.DishType;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RestaurantAddonService {
    private static final String DEFAULT_KEY = "__default__";
    private final Map<String, List<ToppingOption>> catalog = new ConcurrentHashMap<>();

    @PostConstruct
    void loadDefaults() {
        List<ToppingOption> defaults = List.of(
                createDefault("extra-cheese", "Extra Cheese", 1.50, "Creamy mozzarella topping", Set.of(DishType.VEGETARIAN, DishType.NON_VEGETARIAN)),
                createDefault("extra-sauce", "Extra Sauce", 0.75, "House special dipping sauce", Set.of()),
                createDefault("gluten-free", "Gluten Free Base", 2.00, "Swap to gluten free base", Set.of(DishType.VEGETARIAN, DishType.VEGAN)),
                createDefault("double-protein", "Double Protein", 3.25, "Add more meat or tofu", Set.of(DishType.NON_VEGETARIAN, DishType.VEGAN)),
                createDefault("avocado", "Add Avocado", 2.50, "Fresh sliced avocado", Set.of(DishType.VEGETARIAN, DishType.VEGAN))
        );
        catalog.put(DEFAULT_KEY, defaults);
    }

    public List<ToppingOption> getToppingsForRestaurant(String restaurantId) {
        List<ToppingOption> combined = new ArrayList<>();
        combined.addAll(copyList(catalog.getOrDefault(DEFAULT_KEY, List.of())));
        combined.addAll(copyList(catalog.getOrDefault(restaurantId, List.of())));
        return combined;
    }

    public Optional<ToppingOption> findOption(String restaurantId, String toppingId) {
        return catalog.getOrDefault(restaurantId, List.of()).stream()
                .filter(t -> t.getId().equals(toppingId))
                .findFirst()
                .or(() -> catalog.getOrDefault(DEFAULT_KEY, List.of()).stream()
                        .filter(t -> t.getId().equals(toppingId))
                        .findFirst());
    }

    public void registerForRestaurant(String restaurantId, List<ToppingOption> options) {
        catalog.put(restaurantId, copyList(options));
    }

    public void upsertOption(String restaurantId, ToppingOption option) {
        option.setRemovable(true);
        catalog.computeIfAbsent(restaurantId, k -> new ArrayList<>());
        catalog.get(restaurantId).removeIf(t -> t.getId().equals(option.getId()));
        catalog.get(restaurantId).add(copy(option));
    }

    public boolean removeOption(String restaurantId, String optionId) {
        List<ToppingOption> list = catalog.get(restaurantId);
        if (list == null) return false;
        boolean removed = list.removeIf(t -> t.getId().equals(optionId));
        if (list.isEmpty()) catalog.remove(restaurantId);
        return removed;
    }

    private ToppingOption createDefault(String id, String name, double price, String description, Set<DishType> types) {
        ToppingOption option = new ToppingOption(id, name, price, description, types);
        option.setRemovable(false);
        return option;
    }

    private List<ToppingOption> copyList(List<ToppingOption> source) {
        List<ToppingOption> list = new ArrayList<>();
        if (source != null) {
            for (ToppingOption option : source) {
                list.add(copy(option));
            }
        }
        return list;
    }

    private ToppingOption copy(ToppingOption src) {
        if (src == null) return null;
        ToppingOption clone = new ToppingOption(src.getId(), src.getName(), src.getPrice(), src.getDescription(), src.getCompatibleTypes());
        clone.setRemovable(src.isRemovable());
        return clone;
    }
}
