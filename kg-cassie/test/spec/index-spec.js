KISSY.add(function (S, Node,Demo) {
    var $ = Node.all;
    describe('kg-cassie', function () {
        it('Instantiation of components',function(){
            var demo = new Demo();
            expect(S.isObject(demo)).toBe(true);
        })
    });

},{requires:['node','kg/kg-cassie/1.0.0/']});