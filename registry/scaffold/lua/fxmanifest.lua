fx_version 'cerulean'
game 'gta5'

author '9AM Studios'
description '9AM Script'
version '1.0.0'

-- The built React app. `web/dist` is gitignored — run `bun run build` in web/
-- before testing in-game, and before packaging a release.
ui_page 'web/dist/index.html'

shared_scripts {
    '@ox_lib/init.lua',
    '@qbx_core/modules/lib.lua',
    'shared/config.lua',
    'shared/locale.lua',   -- must load after config (reads Config.Locale)
}

client_scripts {
    '@qbx_core/modules/playerdata.lua',
    'client/framework.lua',
    'client/nui.lua',
    'client/main.lua',
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/bridge.lua',
    'server/main.lua',
}

files {
    'web/dist/index.html',
    'web/dist/**/*',
    'locales/*.json',
}

lua54 'yes'
