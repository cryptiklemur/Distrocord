import * as Constants from "./Constants";

export const BASE_URL = "/api/v" + Constants.GATEWAY_VERSION;
export const CDN_URL  = "https://cdn.discordapp.com";

export const CHANNEL                           = (chanID) => `/channels/${chanID}`;
export const CHANNEL_BULK_DELETE               = (chanID) => `/channels/${chanID}/messages/bulk_delete`;
export const CHANNEL_CALL_RING                 = (chanID) => `/channels/${chanID}/call/ring`;
export const CHANNEL_INVITES                   = (chanID) => `/channels/${chanID}/invites`;
export const CHANNEL_MESSAGE_REACTION          =
                 (chanID, msgID, reaction) => `/channels/${chanID}/messages/${msgID}/reactions/${reaction}`;
export const CHANNEL_MESSAGE_REACTION_USER     =
                 (
                     chanID,
                     msgID,
                     reaction,
                     userID,
                 ) => `/channels/${chanID}/messages/${msgID}/reactions/${reaction}/${userID}`;
export const CHANNEL_MESSAGE_REACTIONS         = (chanID, msgID) => `/channels/${chanID}/messages/${msgID}/reactions`;
export const CHANNEL_MESSAGE                   = (chanID, msgID) => `/channels/${chanID}/messages/${msgID}`;
export const CHANNEL_MESSAGES                  = (chanID) => `/channels/${chanID}/messages`;
export const CHANNEL_MESSAGES_SEARCH           = (chanID) => `/channels/${chanID}/messages/search`;
export const CHANNEL_PERMISSION                = (chanID, overID) => `/channels/${chanID}/permissions/${overID}`;
export const CHANNEL_PERMISSIONS               = (chanID) => `/channels/${chanID}/permissions`;
export const CHANNEL_PIN                       = (chanID, msgID) => `/channels/${chanID}/pins/${msgID}`;
export const CHANNEL_PINS                      = (chanID) => `/channels/${chanID}/pins`;
export const CHANNEL_RECIPIENT                 = (groupID, userID) => `/channels/${groupID}/recipients/${userID}`;
export const CHANNEL_TYPING                    = (chanID) => `/channels/${chanID}/typing`;
export const CHANNEL_WEBHOOKS                  = (chanID) => `/channels/${chanID}/webhooks`;
export const CHANNELS                          = "/channels";
export const GATEWAY                           = "/gateway";
export const GATEWAY_BOT                       = "/gateway/bot";
export const GUILD                             = (guildID) => `/guilds/${guildID}`;
export const GUILD_AUDIT_LOGS                  = (guildID) => `/guilds/${guildID}/audit-logs`;
export const GUILD_BAN                         = (guildID, memberID) => `/guilds/${guildID}/bans/${memberID}`;
export const GUILD_BANS                        = (guildID) => `/guilds/${guildID}/bans`;
export const GUILD_CHANNELS                    = (guildID) => `/guilds/${guildID}/channels`;
export const GUILD_EMBED                       = (guildID) => `/guilds/${guildID}/embed`;
export const GUILD_EMOJI                       = (guildID, emojiID) => `/guilds/${guildID}/emojis/${emojiID}`;
export const GUILD_EMOJIS                      = (guildID) => `/guilds/${guildID}/emojis`;
export const GUILD_INTEGRATION                 = (guildID, inteID) => `/guilds/${guildID}/integrations/${inteID}`;
export const GUILD_INTEGRATION_SYNC            =
                 (guildID, inteID) => `/guilds/${guildID}/integrations/${inteID}/sync`;
export const GUILD_INTEGRATIONS                = (guildID) => `/guilds/${guildID}/integrations`;
export const GUILD_INVITES                     = (guildID) => `/guilds/${guildID}/invites`;
export const GUILD_MEMBER                      = (guildID, memberID) => `/guilds/${guildID}/members/${memberID}`;
export const GUILD_MEMBER_NICK                 = (guildID, memberID) => `/guilds/${guildID}/members/${memberID}/nick`;
export const GUILD_MEMBER_ROLE                 =
                 (guildID, memberID, roleID) => `/guilds/${guildID}/members/${memberID}/roles/${roleID}`;
export const GUILD_MEMBERS                     = (guildID) => `/guilds/${guildID}/members`;
export const GUILD_MESSAGES_SEARCH             = (guildID) => `/guilds/${guildID}/messages/search`;
export const GUILD_PRUNE                       = (guildID) => `/guilds/${guildID}/prune`;
export const GUILD_ROLE                        = (guildID, roleID) => `/guilds/${guildID}/roles/${roleID}`;
export const GUILD_ROLES                       = (guildID) => `/guilds/${guildID}/roles`;
export const GUILD_VOICE_REGIONS               = (guildID) => `/guilds/${guildID}/regions`;
export const GUILD_WEBHOOKS                    = (guildID) => `/guilds/${guildID}/webhooks`;
export const GUILDS                            = "/guilds";
export const INVITE                            = (inviteID) => `/invite/${inviteID}`;
export const OAUTH2_APPLICATION                = (appID) => `/oauth2/applications/${appID}`;
export const USER                              = (userID) => `/users/${userID}`;
export const USER_BILLING                      = (userID) => `/users/${userID}/billing`;
export const USER_BILLING_PAYMENTS             = (userID) => `/users/${userID}/billing/payments`;
export const USER_BILLING_PREMIUM_SUBSCRIPTION = (userID) => `/users/${userID}/billing/premium-subscription`;
export const USER_CHANNELS                     = (userID) => `/users/${userID}/channels`;
export const USER_CONNECTIONS                  = (userID) => `/users/${userID}/connections`;
export const USER_CONNECTION_PLATFORM          =
                 (userID, platform, id) => `/users/${userID}/connections/${platform}/${id}`;
export const USER_GUILD                        = (userID, guildID) => `/users/${userID}/guilds/${guildID}`;
export const USER_GUILDS                       = (userID) => `/users/${userID}/guilds`;
export const USER_MFA_CODES                    = (userID) => `/users/${userID}/mfa/codes`;
export const USER_MFA_TOTP_DISABLE             = (userID) => `/users/${userID}/mfa/totp/disable`;
export const USER_MFA_TOTP_ENABLE              = (userID) => `/users/${userID}/mfa/totp/enable`;
export const USER_NOTE                         = (userID, targetID) => `/users/${userID}/note/${targetID}`;
export const USER_PROFILE                      = (userID) => `/users/${userID}/profile`;
export const USER_RELATIONSHIP                 = (userID, relID) => `/users/${userID}/relationships/${relID}`;
export const USER_SETTINGS                     = (userID) => `/users/${userID}/settings`;
export const USERS                             = "/users";
export const VOICE_REGIONS                     = "/voice/regions";
export const WEBHOOK                           = (hookID) => `/webhooks/${hookID}`;
export const WEBHOOK_TOKEN                     = (hookID, token) => `/webhooks/${hookID}/${token}`;
export const WEBHOOK_SLACK                     = (hookID) => `/webhooks/${hookID}/slack`;
export const WEBHOOK_TOKEN_SLACK               = (hookID, token) => `/webhooks/${hookID}/${token}/slack`;
