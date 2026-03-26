// Generate a random master key (256 bits)
export async function generateMasterKey() {
  return crypto.getRandomValues(new Uint8Array(32));
}

// Derive key from password using PBKDF2
export async function deriveKeyFromPassword(password, salt) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  
  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Derive key from recovery phrase
export async function deriveKeyFromRecoveryPhrase(recoveryPhrase, salt) {
  const encoder = new TextEncoder();
  const normalizedPhrase = recoveryPhrase.toLowerCase().trim();
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(normalizedPhrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  
  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Encrypt master key with password or recovery phrase
export async function encryptMasterKey(masterKey, key) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    masterKey
  );
  
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  
  return combined;
}

// Decrypt master key
export async function decryptMasterKey(encryptedMasterKey, key) {
  const iv = encryptedMasterKey.slice(0, 12);
  const data = encryptedMasterKey.slice(12);
  
  return await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
}

// Word list for recovery phrase (BIP39 English wordlist subset)
const WORD_LIST = [
  'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse',
  'access', 'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act',
  'action', 'actor', 'actress', 'actual', 'adapt', 'add', 'addict', 'address', 'adjust', 'admit',
  'adult', 'advance', 'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent',
  'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alcohol', 'alert',
  'alien', 'all', 'alley', 'allow', 'almost', 'alone', 'alpha', 'already', 'also', 'alter',
  'always', 'amateur', 'amazing', 'among', 'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger',
  'angle', 'angry', 'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique',
  'anxiety', 'any', 'apart', 'apology', 'appear', 'apple', 'approach', 'approve', 'april', 'arch',
  'arctic', 'area', 'arena', 'argue', 'arm', 'armed', 'armor', 'army', 'around', 'arrange',
  'arrest', 'arrive', 'arrow', 'art', 'artist', 'artwork', 'ask', 'aspect', 'assault', 'asset',
  'assist', 'assume', 'asthma', 'athlete', 'atom', 'attack', 'attend', 'attract', 'auction', 'audit',
  'august', 'aunt', 'author', 'auto', 'autumn', 'average', 'avocado', 'avoid', 'awake', 'aware',
  'away', 'awesome', 'awful', 'awkward', 'axis', 'baby', 'bachelor', 'bacon', 'badge', 'bag',
  'balance', 'balcony', 'ball', 'bamboo', 'banana', 'banner', 'bar', 'barely', 'bargain', 'barrel',
  'base', 'basic', 'basket', 'battle', 'beach', 'bean', 'beauty', 'because', 'become', 'beef',
  'before', 'begin', 'behave', 'behind', 'believe', 'below', 'belt', 'bench', 'benefit', 'best',
  'betray', 'better', 'between', 'beyond', 'bicycle', 'bid', 'bike', 'bind', 'biology', 'bird',
  'birth', 'bitter', 'black', 'blade', 'blame', 'blanket', 'blast', 'bleak', 'bless', 'blind',
  'blood', 'blossom', 'blouse', 'bluetooth', 'blur', 'board', 'boat', 'body', 'boil', 'bomb',
  'bone', 'bonus', 'book', 'boost', 'border', 'boring', 'borrow', 'boss', 'bottom', 'bounce',
  'box', 'boy', 'bracket', 'brain', 'brand', 'brass', 'brave', 'bread', 'breeze', 'brick',
  'bridge', 'brief', 'bright', 'bring', 'brisk', 'broccoli', 'broken', 'bronze', 'broom', 'brother',
  'brown', 'brush', 'bubble', 'buddy', 'budget', 'buffalo', 'build', 'bulb', 'bulk', 'bullet',
  'bundle', 'bunker', 'burden', 'burger', 'burst', 'bus', 'business', 'busy', 'butter', 'buyer',
  'cabin', 'cable', 'cactus', 'cage', 'cake', 'call', 'calm', 'camera', 'camp', 'canal',
  'cancel', 'candy', 'cannon', 'canoe', 'canvas', 'canyon', 'capable', 'capital', 'captain', 'car',
  'carbon', 'card', 'cargo', 'carpet', 'carry', 'cart', 'case', 'cash', 'casino', 'castle',
  'casual', 'cat', 'catalog', 'catch', 'category', 'cattle', 'caught', 'cause', 'caution', 'cave',
  'ceiling', 'cell', 'cement', 'census', 'center', 'ceramic', 'chain', 'chair', 'chalk', 'champion',
  'chance', 'change', 'chaos', 'chapter', 'charge', 'charm', 'chart', 'chase', 'chat', 'cheap',
  'check', 'cheese', 'chef', 'cherry', 'chest', 'chicken', 'chief', 'child', 'chimney', 'choice',
  'choose', 'chronic', 'chunk', 'cigar', 'cinnamon', 'circle', 'citizen', 'city', 'civil', 'claim',
  'clap', 'clarify', 'clarity', 'claw', 'clay', 'clean', 'clerk', 'clever', 'click', 'client',
  'cliff', 'climb', 'clinic', 'clip', 'clock', 'clone', 'close', 'cloth', 'cloud', 'coach',
  'coast', 'coat', 'code', 'coffee', 'coin', 'cold', 'collar', 'collect', 'color', 'column',
  'comedy', 'comfort', 'comic', 'common', 'company', 'concert', 'conduct', 'confirm', 'connect', 'consensus',
  'consider', 'constant', 'construct', 'contact', 'contain', 'content', 'contest', 'context', 'control', 'convert',
  'cookie', 'cool', 'copper', 'copy', 'coral', 'core', 'corn', 'correct', 'cost', 'cotton',
  'couch', 'country', 'couple', 'course', 'cousin', 'cover', 'cow', 'crack', 'craft', 'crash',
  'craw', 'crazy', 'cream', 'credit', 'cricket', 'crime', 'critic', 'crop', 'cross', 'crowd',
  'crucial', 'cruel', 'crunch', 'crush', 'crystal', 'cube', 'culture', 'cup', 'curtain', 'curve',
  'cushion', 'custom', 'cycle', 'dad', 'damage', 'dance', 'danger', 'daring', 'dark', 'data',
  'date', 'dawn', 'day', 'deal', 'debate', 'debris', 'decade', 'december', 'decide', 'decline',
  'decorate', 'decrease', 'deer', 'defense', 'define', 'degree', 'delay', 'deliver', 'demand', 'demise',
  'deny', 'dense', 'dentist', 'depend', 'deposit', 'depth', 'deputy', 'derive', 'desert', 'design',
  'desk', 'despair', 'destroy', 'detail', 'detect', 'develop', 'device', 'devote', 'diagram', 'dial',
  'diamond', 'diary', 'dice', 'digital', 'dignity', 'dilemma', 'dinner', 'dinosaur', 'direct', 'dirt',
  'disagree', 'discover', 'disease', 'dish', 'dismiss', 'disorder', 'display', 'distance', 'divert', 'divide',
  'divorce', 'doctor', 'document', 'dodge', 'doll', 'dolphin', 'domain', 'donate', 'donkey', 'donor',
  'door', 'dose', 'double', 'dove', 'draft', 'dragon', 'drama', 'drastic', 'draw', 'dream',
  'dress', 'drift', 'drill', 'drink', 'drip', 'drive', 'drop', 'drum', 'drunk', 'dry',
  'duck', 'dumb', 'dump', 'duration', 'dust', 'duty', 'dwarf', 'dynamic', 'eager', 'eagle',
  'early', 'earn', 'earth', 'easily', 'east', 'easy', 'echo', 'ecology', 'economy', 'edge',
  'edge', 'edit', 'editor', 'educate', 'effort', 'eight', 'either', 'elbow', 'elder', 'electric',
  'elegant', 'element', 'elephant', 'elevator', 'elite', 'embark', 'embrace', 'emerge', 'emotion', 'employ',
  'empty', 'enable', 'enact', 'end', 'endless', 'endorse', 'enemy', 'energy', 'enforce', 'engage',
  'engine', 'enhance', 'enjoy', 'enlist', 'enough', 'enrich', 'ensure', 'enter', 'entire', 'entrance',
  'entry', 'envelope', 'episode', 'equal', 'equip', 'era', 'erase', 'erosion', 'error', 'erupt',
  'escape', 'essay', 'essence', 'estate', 'eternal', 'ethics', 'evidence', 'evil', 'evoke', 'evolve',
  'exact', 'example', 'excess', 'exchange', 'excite', 'exclude', 'excuse', 'exercise', 'exhaust', 'exhibit',
  'exile', 'exist', 'exit', 'exotic', 'expand', 'expect', 'expire', 'explain', 'expose', 'express',
  'extend', 'extra', 'eye', 'fabric', 'face', 'faculty', 'fade', 'fail', 'faint', 'fair',
  'faith', 'fall', 'false', 'fame', 'familiar', 'family', 'famous', 'fan', 'fancy', 'fantasy',
  'farm', 'fashion', 'fat', 'fatal', 'father', 'fatigue', 'fault', 'favor', 'feast', 'federal',
  'fee', 'feed', 'feel', 'female', 'fence', 'festival', 'fever', 'fiber', 'fiction', 'field',
  'fierce', 'fifteen', 'fight', 'file', 'fill', 'film', 'filter', 'final', 'find', 'fine',
  'finger', 'finish', 'fire', 'firm', 'first', 'fiscal', 'fish', 'fit', 'fitness', 'fix',
  'flag', 'flame', 'flash', 'flat', 'flavor', 'flee', 'flesh', 'flight', 'float', 'flock',
  'flood', 'floor', 'flour', 'flower', 'fluid', 'flush', 'fly', 'foam', 'focus', 'fog',
  'fold', 'folk', 'follow', 'food', 'foot', 'force', 'forest', 'forget', 'fork', 'fortune',
  'forum', 'forward', 'fossil', 'foster', 'found', 'fox', 'fragile', 'frame', 'frequent', 'fresh',
  'friend', 'front', 'frost', 'fruit', 'fuel', 'full', 'fun', 'function', 'funny', 'furnace',
  'future', 'gadget', 'gain', 'galaxy', 'gallery', 'game', 'gap', 'garage', 'garbage', 'garden',
  'garlic', 'gas', 'gate', 'gather', 'gauge', 'gaze', 'general', 'genius', 'genre', 'gentle',
  'genuine', 'gesture', 'ghost', 'giant', 'gift', 'girl', 'give', 'glad', 'glance', 'glass',
  'glimpse', 'globe', 'gloom', 'glory', 'glove', 'glow', 'glue', 'goal', 'gold', 'golf',
  'good', 'gorilla', 'gospel', 'gossip', 'govern', 'gown', 'grab', 'grace', 'grain', 'grant',
  'grape', 'graph', 'grasp', 'grass', 'grave', 'gravity', 'gray', 'great', 'green', 'greet',
  'grief', 'grill', 'grind', 'grip', 'grocery', 'gross', 'ground', 'group', 'grow', 'growth',
  'guard', 'guess', 'guide', 'guilt', 'guitar', 'gun', 'gym', 'habit', 'hair', 'half',
  'hammer', 'hand', 'happy', 'harbor', 'hard', 'harsh', 'harvest', 'hat', 'have', 'hawk',
  'hazard', 'head', 'health', 'heart', 'heavy', 'hedge', 'height', 'hello', 'helmet', 'help',
  'hen', 'hero', 'hidden', 'high', 'hill', 'hint', 'hip', 'hire', 'history', 'hobby',
  'hockey', 'hold', 'hole', 'holiday', 'hollow', 'hope', 'horizon', 'horn', 'horror', 'horse',
  'hospital', 'host', 'hotel', 'hour', 'house', 'hover', 'huge', 'human', 'humble', 'humor',
  'hundred', 'hungry', 'hunt', 'hurdle', 'hurry', 'hurt', 'husband', 'hybrid', 'ice', 'icon',
  'idea', 'identify', 'ignore', 'image', 'impact', 'imply', 'import', 'impose', 'impulse', 'inch',
  'include', 'income', 'increase', 'index', 'indicate', 'indoor', 'industry', 'infant', 'inflict', 'inform',
  'ink', 'input', 'innocent', 'inquiry', 'inside', 'install', 'intact', 'interest', 'into', 'invest',
  'invite', 'involve', 'iron', 'island', 'isolate', 'issue', 'item', 'ivory', 'jacket', 'jaguar',
  'jar', 'jazz', 'jeans', 'jeep', 'job', 'jewel', 'join', 'joke', 'journey', 'joy',
  'judge', 'juice', 'jump', 'jungle', 'junior', 'junk', 'just', 'kangaroo', 'keen', 'keep',
  'ketchup', 'key', 'kick', 'kid', 'kidney', 'kind', 'kingdom', 'kiss', 'kit', 'kitchen',
  'kite', 'kitten', 'kiwi', 'knee', 'knife', 'knock', 'know', 'lab', 'label', 'labor',
  'ladder', 'lady', 'lake', 'lamp', 'language', 'laptop', 'large', 'later', 'latin', 'laugh',
  'lava', 'laundry', 'lawn', 'lawsuit', 'layer', 'lazy', 'leader', 'leaf', 'learn', 'leave',
  'lecture', 'left', 'leg', 'legendary', 'lemon', 'lend', 'length', 'lens', 'leopard', 'lesson',
  'letter', 'level', 'liar', 'liberty', 'library', 'license', 'life', 'lift', 'light', 'like',
  'limb', 'limit', 'link', 'lion', 'liquid', 'list', 'little', 'live', 'lizard', 'load',
  'loan', 'lobster', 'local', 'lock', 'logic', 'lonely', 'long', 'loop', 'lottery', 'love',
  'lucky', 'luggage', 'lumber', 'lunar', 'lunch', 'luxury', 'lyrics', 'machine', 'mad', 'magic',
  'magnet', 'mail', 'main', 'make', 'mammal', 'mango', 'manage', 'mandate', 'mango', 'manor',
  'map', 'marble', 'march', 'margin', 'marine', 'market', 'marriage', 'mask', 'mass', 'master',
  'match', 'mate', 'material', 'math', 'matrix', 'matter', 'maximum', 'maze', 'meal', 'mean',
  'measure', 'meat', 'mechanic', 'medal', 'media', 'melon', 'melt', 'member', 'memory', 'mention',
  'menu', 'mercy', 'merge', 'merit', 'merry', 'mesh', 'message', 'metal', 'method', 'middle',
  'midnight', 'milk', 'million', 'mimic', 'mind', 'minimum', 'minor', 'minute', 'miracle', 'mirror',
  'misery', 'miss', 'mistake', 'mix', 'mixed', 'mixture', 'mobile', 'model', 'modify', 'mom',
  'moment', 'monkey', 'monster', 'month', 'moon', 'moral', 'more', 'morning', 'mosquito', 'mother',
  'motion', 'motor', 'mountain', 'mouse', 'move', 'movie', 'much', 'muffin', 'mule', 'multiply',
  'muscle', 'museum', 'mushroom', 'music', 'must', 'mutual', 'myself', 'mystery', 'myth', 'naive',
  'name', 'napkin', 'narrow', 'nasty', 'nation', 'native', 'natural', 'nature', 'navigate', 'navy',
  'near', 'neck', 'need', 'negative', 'neglect', 'neither', 'nephew', 'nerve', 'nest', 'net',
  'network', 'neutral', 'never', 'news', 'next', 'nice', 'night', 'noble', 'noise', 'nominee',
  'noodle', 'normal', 'north', 'nose', 'notable', 'note', 'nothing', 'notice', 'novel', 'now',
  'nuclear', 'number', 'nurse', 'nut', 'obey', 'object', 'oblige', 'obscure', 'observe', 'obtain',
  'obvious', 'occur', 'ocean', 'october', 'odor', 'offer', 'office', 'often', 'oil', 'okay',
  'old', 'olive', 'olympic', 'omit', 'once', 'one', 'onion', 'online', 'only', 'open',
  'opera', 'opinion', 'oppose', 'option', 'orange', 'orbit', 'orchard', 'order', 'ordinary', 'organ',
  'orient', 'original', 'orphan', 'ostrich', 'other', 'outdoor', 'outer', 'outline', 'output', 'outside',
  'oven', 'over', 'own', 'owner', 'oxygen', 'oyster', 'ozone', 'pact', 'paddle', 'page',
  'pair', 'palace', 'palm', 'panda', 'panel', 'panic', 'panther', 'paper', 'parade', 'parent',
  'park', 'parrot', 'party', 'pass', 'patch', 'path', 'patient', 'patrol', 'pattern', 'pause',
  'pave', 'payment', 'peace', 'peanut', 'pear', 'peasant', 'pelican', 'pen', 'penalty', 'pencil',
  'people', 'pepper', 'perfect', 'permit', 'person', 'pet', 'phone', 'photo', 'phrase', 'physical',
  'piano', 'pick', 'picture', 'pioneer', 'pig', 'pigeon', 'pill', 'pilot', 'pink', 'pioneer',
  'pipe', 'pistol', 'pitch', 'pizza', 'place', 'planet', 'plastic', 'plate', 'play', 'please',
  'pledge', 'pluck', 'plug', 'plunge', 'poem', 'poet', 'point', 'polar', 'pole', 'police',
  'pond', 'pony', 'pool', 'popular', 'portion', 'position', 'possible', 'post', 'potato', 'pottery',
  'poverty', 'powder', 'power', 'practice', 'praise', 'predict', 'prefer', 'prepare', 'present', 'pretty',
  'prevent', 'price', 'pride', 'primary', 'print', 'priority', 'prison', 'private', 'prize', 'problem',
  'process', 'produce', 'profit', 'program', 'project', 'promote', 'proof', 'property', 'protect', 'protein',
  'proud', 'prove', 'provide', 'public', 'pudding', 'pull', 'pulp', 'pulse', 'pumpkin', 'punch',
  'pupil', 'puppy', 'purchase', 'purity', 'purpose', 'purse', 'push', 'put', 'puzzle', 'pyramid',
  'quality', 'quantum', 'quarter', 'question', 'quick', 'quit', 'quiz', 'quote', 'rabbit', 'raccoon',
  'race', 'rack', 'radar', 'radio', 'rail', 'rain', 'raise', 'rally', 'ramp', 'ranch',
  'random', 'range', 'rapid', 'rat', 'rate', 'rather', 'raven', 'raw', 'razor', 'reach',
  'read', 'ready', 'real', 'reason', 'rebel', 'rebuild', 'recall', 'receive', 'recipe', 'record',
  'recycle', 'reduce', 'reform', 'refuse', 'region', 'regret', 'regular', 'reject', 'relax', 'release',
  'relief', 'remain', 'remember', 'remove', 'render', 'renew', 'rent', 'reopen', 'repair', 'repeat',
  'replace', 'report', 'require', 'rescue', 'resemble', 'resist', 'resource', 'response', 'result', 'retire',
  'retreat', 'return', 'reunion', 'reveal', 'review', 'reward', 'rhythm', 'rib', 'ribbon', 'rice',
  'riddle', 'ride', 'ridge', 'rifle', 'right', 'rigid', 'ring', 'riot', 'ripple', 'risk',
  'ritual', 'rival', 'river', 'road', 'roast', 'robot', 'rock', 'rocket', 'roof', 'room',
  'root', 'rope', 'rose', 'rotate', 'rough', 'round', 'route', 'royal', 'rubber', 'rude',
  'rug', 'rule', 'run', 'runway', 'rural', 'sad', 'saddle', 'sadness', 'safe', 'sail',
  'salad', 'salmon', 'salon', 'salt', 'salute', 'same', 'sample', 'sand', 'satisfy', 'satoshi',
  'sauce', 'sausage', 'save', 'scale', 'scare', 'scatter', 'scene', 'scheme', 'school', 'science',
  'scissors', 'scorpion', 'scout', 'scrap', 'screen', 'script', 'scrub', 'sea', 'search', 'season',
  'seat', 'secret', 'section', 'security', 'seed', 'seek', 'segment', 'select', 'sell', 'seminar',
  'senior', 'sense', 'sentence', 'series', 'service', 'session', 'settle', 'setup', 'seven', 'shadow',
  'shaft', 'shallow', 'share', 'shed', 'shell', 'sheriff', 'shield', 'shift', 'shine', 'ship',
  'shiver', 'shock', 'shoe', 'shoot', 'shop', 'short', 'shoulder', 'shove', 'shrimp', 'shrug',
  'shuffle', 'shy', 'sibling', 'sick', 'side', 'siege', 'sight', 'sign', 'silent', 'silk',
  'silly', 'silver', 'similar', 'simple', 'since', 'sing', 'siren', 'sister', 'situation', 'six',
  'size', 'skate', 'ski', 'skill', 'skin', 'skirt', 'skull', 'slab', 'slam', 'sleep',
  'slender', 'slice', 'slide', 'slight', 'slim', 'slogan', 'slot', 'slow', 'slush', 'small',
  'smart', 'smile', 'smoke', 'snack', 'snake', 'snap', 'sniff', 'snow', 'soap', 'soccer',
  'social', 'sock', 'soda', 'sofa', 'soft', 'software', 'soil', 'solar', 'soldier', 'solution',
  'solve', 'some', 'son', 'song', 'soon', 'sorry', 'sort', 'soul', 'sound', 'soup',
  'source', 'south', 'space', 'spare', 'spatial', 'spawn', 'speak', 'special', 'speed', 'spell',
  'spend', 'sphere', 'spider', 'spike', 'spin', 'spirit', 'split', 'spoil', 'sponsor', 'spoon',
  'sport', 'spot', 'spray', 'spread', 'spring', 'spy', 'square', 'squeeze', 'squirrel', 'stable',
  'stadium', 'staff', 'stage', 'stairs', 'stamp', 'stand', 'start', 'state', 'stay', 'steak',
  'steel', 'stem', 'step', 'stereo', 'stick', 'still', 'sting', 'stock', 'stomach', 'stone',
  'stool', 'story', 'stove', 'strategy', 'street', 'strike', 'strong', 'string', 'strip', 'stroke',
  'stuff', 'stumble', 'style', 'subject', 'submit', 'subway', 'succeed', 'such', 'sudden', 'suffer',
  'sugar', 'suggest', 'suit', 'summer', 'sun', 'sunny', 'sunset', 'super', 'supply', 'supreme',
  'sure', 'surface', 'surge', 'surprise', 'surround', 'survey', 'swamp', 'swan', 'swarm', 'swear',
  'sweat', 'sweep', 'sweet', 'swim', 'swing', 'switch', 'sword', 'symbol', 'symptom', 'system',
  'table', 'tackle', 'tag', 'tail', 'talent', 'talk', 'tank', 'tape', 'target', 'task',
  'taste', 'tattoo', 'taxi', 'teach', 'team', 'tell', 'ten', 'tenant', 'tennis', 'tent',
  'term', 'test', 'text', 'thank', 'that', 'theme', 'then', 'theory', 'there', 'they',
  'thick', 'thin', 'thirteen', 'thirty', 'this', 'thorough', 'thousand', 'three', 'thrive', 'throw',
  'thumb', 'thunder', 'ticket', 'tide', 'tiger', 'tilt', 'timber', 'time', 'tiny', 'tip',
  'tired', 'tissue', 'title', 'toast', 'tobacco', 'today', 'toddler', 'toe', 'together', 'toilet',
  'token', 'tomato', 'tomorrow', 'tone', 'tongue', 'tonight', 'tool', 'tooth', 'top', 'topic',
  'topple', 'torch', 'tornado', 'tortoise', 'toss', 'total', 'touch', 'tough', 'tour', 'tower',
  'town', 'toy', 'track', 'trade', 'traffic', 'tragic', 'train', 'trap', 'trash', 'travel',
  'tray', 'treat', 'tree', 'trend', 'trial', 'tribe', 'trick', 'trigger', 'trim', 'trip',
  'trophy', 'trouble', 'truck', 'true', 'truly', 'trumpet', 'trust', 'truth', 'try', 'tube',
  'tuition', 'tumble', 'tuna', 'tunnel', 'turkey', 'turn', 'turtle', 'twelve', 'twenty', 'twice',
  'twin', 'twist', 'two', 'type', 'typical', 'ugly', 'umbrella', 'unable', 'unaware', 'uncle',
  'uncover', 'under', 'undo', 'unfair', 'unfold', 'unhappy', 'uniform', 'unique', 'unit', 'universe',
  'unknown', 'unlock', 'until', 'unusual', 'unveil', 'update', 'upgrade', 'uphold', 'upon', 'upper',
  'upset', 'urban', 'urge', 'usage', 'use', 'used', 'useful', 'useless', 'usual', 'utility',
  'vacant', 'vacuum', 'valid', 'valley', 'valve', 'van', 'vanish', 'vapor', 'various', 'vast',
  'vault', 'vector', 'veal', 'vegan', 'vehicle', 'velvet', 'vendor', 'venture', 'venue', 'verb',
  'verify', 'version', 'very', 'vessel', 'veteran', 'viable', 'vibrant', 'vicious', 'victim', 'video',
  'view', 'village', 'vintage', 'violin', 'virtue', 'virus', 'visa', 'visit', 'vital', 'vivid',
  'vocal', 'voice', 'void', 'volcano', 'volume', 'vote', 'voyage', 'wage', 'wagon', 'wait',
  'walk', 'wall', 'walnut', 'want', 'warfare', 'warm', 'warrior', 'wash', 'wasp', 'waste',
  'water', 'wave', 'way', 'wealth', 'weapon', 'wear', 'weather', 'web', 'wedding', 'weekend',
  'weird', 'welcome', 'west', 'wet', 'whale', 'what', 'wheat', 'wheel', 'when', 'where',
  'whereas', 'whether', 'whip', 'whisper', 'white', 'wholesale', 'whom', 'whose', 'why', 'wide',
  'widow', 'width', 'wife', 'wild', 'will', 'win', 'window', 'wine', 'wing', 'winner',
  'winter', 'wire', 'wisdom', 'wise', 'wish', 'witness', 'wolf', 'woman', 'wonder', 'wood',
  'wool', 'word', 'work', 'material', 'world', 'worry', 'worth', 'wrap', 'wreck', 'wrestle',
  'wrist', 'write', 'wrong', 'yard', 'year', 'yellow', 'you', 'young', 'youth', 'zebra',
  'zero', 'zone', 'zoo'
];

// Generate a 12-word recovery phrase
export function generateRecoveryPhrase() {
  const words = [];
  const randomValues = crypto.getRandomValues(new Uint8Array(12));
  
  for (let i = 0; i < 12; i++) {
    const index = randomValues[i] % WORD_LIST.length;
    words.push(WORD_LIST[index]);
  }
  
  return words.join(' ');
}

// Validate recovery phrase format
export function validateRecoveryPhrase(phrase) {
  const words = phrase.toLowerCase().trim().split(/\s+/);
  
  if (words.length !== 12) {
    return { valid: false, error: 'Recovery phrase must be exactly 12 words' };
  }
  
  for (const word of words) {
    if (!WORD_LIST.includes(word)) {
      return { valid: false, error: `Invalid word: "${word}"` };
    }
  }
  
  return { valid: true, error: null };
}

// Get random words for verification
export function getRandomVerificationWords(phrase) {
  const words = phrase.split(' ');
  const indices = [];
  
  while (indices.length < 3) {
    const index = Math.floor(Math.random() * 12);
    if (!indices.includes(index)) {
      indices.push(index);
    }
  }
  
  return indices.map(i => ({ index: i, word: words[i] }));
}