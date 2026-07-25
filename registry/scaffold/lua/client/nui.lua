-- NUI bridge for the 9AM UI kit.
--
-- Pairs with the web side: SendReactMessage(action, data) is received by the
-- `useNuiEvent(action, handler)` hook, and every `fetchNui('name')` call from
-- React lands on a RegisterNUICallback('name') here.
--
-- Rule: every RegisterNUICallback MUST call cb(...) exactly once. A callback
-- that returns without calling cb leaves the awaiting promise hanging forever.

local isNuiOpen = false

---Push a message to the React app.
---@param action string matches the `useNuiEvent` action on the web side
---@param data any JSON-serialisable payload
function SendReactMessage(action, data)
    SendNUIMessage({
        action = action,
        data = data,
    })
end

---Show or hide the NUI frame, taking/releasing input focus with it.
---@param visible boolean
function SetNuiVisible(visible)
    isNuiOpen = visible
    SetNuiFocus(visible, visible)
    SendReactMessage('setVisible', visible)
end

---@return boolean
function IsNuiOpen()
    return isNuiOpen
end

-- The React side calls this on ESC, on its close button, and from its top-level
-- error boundary — a UI crash must never leave the player without input.
RegisterNUICallback('hideFrame', function(_, cb)
    SetNuiVisible(false)
    cb({})
end)

-- Releasing focus on stop matters during development: restarting the resource
-- while the UI is open would otherwise leave the player stuck with no input.
AddEventHandler('onResourceStop', function(resource)
    if resource ~= GetCurrentResourceName() then return end
    if isNuiOpen then
        SetNuiFocus(false, false)
    end
end)
