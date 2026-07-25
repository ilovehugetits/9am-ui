-- Localization module (client + server).
--
-- Strings live in locales/<lang>.json as nested tables; the active language is
-- Config.Locale. English is always loaded as the fallback: a key missing from
-- the active language resolves to the English string, and a key missing from
-- both resolves to the key itself (so a typo is visible in-game, never a crash).
--
-- Usage:  locale('game.purchase.success', { vehicle = label, price = 50000 })
-- Placeholders use {name} syntax and are replaced from the vars table.
--
-- Adding a language: copy locales/en.json to locales/<code>.json, translate the
-- values (keys must stay identical), set Config.Locale = '<code>'. Partial
-- translations are fine - untranslated keys fall back to English.
--
-- The web UI uses the same files: the dictionary is handed to the NUI via the
-- getLocale callback below, so translations never require a web rebuild.

local resourceName = GetCurrentResourceName()

local function loadDict(lang)
    local raw = LoadResourceFile(resourceName, ('locales/%s.json'):format(lang))
    if not raw then return nil end
    local ok, data = pcall(json.decode, raw)
    if not ok or type(data) ~= 'table' then
        print(('^1[%s] locales/%s.json contains invalid JSON and was ignored^0'):format(resourceName, lang))
        return nil
    end
    return data
end

local function deepMerge(base, overlay)
    for k, v in pairs(overlay) do
        if type(v) == 'table' and type(base[k]) == 'table' then
            deepMerge(base[k], v)
        else
            base[k] = v
        end
    end
    return base
end

local dict = loadDict('en') or {}
local activeLang = Config.Locale or 'en'

if activeLang ~= 'en' then
    local overlay = loadDict(activeLang)
    if overlay then
        deepMerge(dict, overlay)
    else
        print(('^3[%s] locales/%s.json not found - falling back to English^0'):format(resourceName, activeLang))
        activeLang = 'en'
    end
end

---Resolve a translation key to a string in the active language.
---@param key string dot-separated path, e.g. 'game.purchase.success'
---@param vars? table<string, string|number> values for {placeholder} substitution
---@return string
function locale(key, vars)
    local node = dict
    for part in key:gmatch('[^%.]+') do
        if type(node) ~= 'table' then
            node = nil
            break
        end
        node = node[part]
    end
    if type(node) ~= 'string' then return key end
    if vars then
        node = node:gsub('{(%w+)}', function(name)
            local value = vars[name]
            if value == nil then return ('{%s}'):format(name) end
            return tostring(value)
        end)
    end
    return node
end

if not IsDuplicityVersion() then
    -- The React app pulls its dictionary once on boot (web/src/i18n).
    RegisterNUICallback('getLocale', function(_, cb)
        cb({ locale = activeLang, dict = dict })
    end)
end
